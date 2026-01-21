<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $query = Notification::where('user_id', auth()->id())
            ->visible()
            ->nonExpire();

        // Filtrage par type
        if ($request->has('type') && $request->type !== 'tous') {
            $query->byType($request->type);
        }

        // Filtrage par catégorie
        if ($request->has('categorie') && $request->categorie !== 'tous') {
            $query->byCategorie($request->categorie);
        }

        // Filtrage par statut (lu/non lu)
        if ($request->has('statut')) {
            if ($request->statut === 'non_lues') {
                $query->nonLues();
            } elseif ($request->statut === 'lues') {
                $query->lues();
            }
        }

        // Filtrage par priorité
        if ($request->has('priorite') && $request->priorite !== 'tous') {
            $query->byPriorite($request->priorite);
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $notifications = $query->orderBy('date_creation', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($notifications);
    }

    public function show(Notification $notification): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if ($notification->user_id !== auth()->id() || !$notification->visible) {
            return response()->json(['message' => 'Notification non trouvée'], 404);
        }

        return response()->json($notification);
    }

    public function markAsRead(Notification $notification): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if ($notification->user_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $notification->marquerCommeLue();

        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        Notification::where('user_id', auth()->id())
            ->nonLues()
            ->update(['lue' => true]);

        return response()->json(['message' => 'Toutes les notifications marquées comme lues']);
    }

    public function unreadCount(): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $count = Notification::where('user_id', auth()->id())
            ->visible()
            ->nonExpire()
            ->nonLues()
            ->count();

        return response()->json(['count' => $count]);
    }

    public function destroy(Notification $notification): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if ($notification->user_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $notification->delete();

        return response()->json(['message' => 'Notification supprimée']);
    }

    public function store(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // Seuls les admins peuvent créer des notifications
        if (!auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,success,warning,error',
            'categorie' => 'required|in:cours,devoir,note,forum,systeme',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'priorite' => 'sometimes|in:basse,moyenne,haute',
            'action_url' => 'nullable|string',
            'action_label' => 'nullable|string',
            'expire_le' => 'nullable|date|after:now'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $notifications = [];
        foreach ($request->user_ids as $userId) {
            $notification = Notification::create([
                'titre' => $request->titre,
                'message' => $request->message,
                'type' => $request->type,
                'categorie' => $request->categorie,
                'user_id' => $userId,
                'lue' => false,
                'priorite' => $request->priorite ?? 'moyenne',
                'action_url' => $request->action_url,
                'action_label' => $request->action_label,
                'date_creation' => now(),
                'expire_le' => $request->expire_le,
                'visible' => true
            ]);
            $notifications[] = $notification;
        }

        return response()->json([
            'message' => 'Notifications créées avec succès',
            'notifications' => $notifications
        ], 201);
    }

    public function statistics(): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $userId = auth()->id();

        $stats = [
            'total' => Notification::where('user_id', $userId)->visible()->nonExpire()->count(),
            'non_lues' => Notification::where('user_id', $userId)->visible()->nonExpire()->nonLues()->count(),
            'par_type' => Notification::where('user_id', $userId)->visible()->nonExpire()
                ->selectRaw('type, count(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type'),
            'par_categorie' => Notification::where('user_id', $userId)->visible()->nonExpire()
                ->selectRaw('categorie, count(*) as count')
                ->groupBy('categorie')
                ->pluck('count', 'categorie'),
            'par_priorite' => Notification::where('user_id', $userId)->visible()->nonExpire()
                ->selectRaw('priorite, count(*) as count')
                ->groupBy('priorite')
                ->pluck('count', 'priorite'),
            'cette_semaine' => Notification::where('user_id', $userId)->visible()->nonExpire()
                ->whereBetween('date_creation', [now()->startOfWeek(), now()->endOfWeek()])
                ->count()
        ];

        return response()->json($stats);
    }
}
