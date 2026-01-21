<?php

namespace App\Http\Controllers\Api\Messagerie;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\User;
use App\Models\Cours;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $query = Conversation::with(['cours', 'createur', 'participants'])
            ->visible()
            ->actives()
            ->pourUtilisateur(auth()->id());

        // Filtrage par type
        if ($request->has('type') && $request->type !== 'tous') {
            $query->byType($request->type);
        }

        // Filtrage par cours
        if ($request->has('cours_id')) {
            $query->byCours($request->cours_id);
        }

        // Filtrage par statut de lecture
        if ($request->has('non_lues') && $request->non_lues) {
            $query->nonLues(auth()->id());
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $conversations = $query->orderBy('dernier_message_date', 'desc')->get();

        // Ajouter les informations spécifiques à l'utilisateur
        $conversations->each(function ($conversation) {
            $conversation->nombre_messages_non_lus = $conversation->getNombreMessagesNonLus(auth()->id());
            $conversation->role_utilisateur = $conversation->getRoleUtilisateur(auth()->id());
        });

        return response()->json($conversations);
    }

    public function show(Conversation $conversation): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$conversation->estParticipant(auth()->id())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $conversation->load(['cours', 'createur', 'participants', 'messages.expediteur', 'messages.tags']);

        // Ajouter les informations spécifiques à l'utilisateur
        $conversation->nombre_messages_non_lus = $conversation->getNombreMessagesNonLus(auth()->id());
        $conversation->role_utilisateur = $conversation->getRoleUtilisateur(auth()->id());

        return response()->json($conversation);
    }

    public function store(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:prive,groupe,matiere',
            'cours_id' => 'nullable|exists:cours,id',
            'participants' => 'required|array|min:1',
            'participants.*' => 'exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Validation spécifique selon le type
        if ($request->type === 'matiere' && !$request->cours_id) {
            return response()->json(['message' => 'Le cours_id est requis pour les conversations de matière'], 422);
        }

        if ($request->type === 'prive' && count($request->participants) !== 1) {
            return response()->json(['message' => 'Une conversation privée doit avoir exactement un participant'], 422);
        }

        DB::beginTransaction();
        try {
            $conversation = Conversation::create([
                'titre' => $request->titre,
                'description' => $request->description,
                'type' => $request->type,
                'cours_id' => $request->cours_id,
                'createur_id' => auth()->id(),
                'statut' => 'actif',
                'nombre_participants' => count($request->participants) + 1, // +1 pour le créateur
                'visible' => true
            ]);

            // Ajouter le créateur comme admin
            $conversation->ajouterParticipant(auth()->id(), 'admin');

            // Ajouter les autres participants
            foreach ($request->participants as $participantId) {
                $role = 'membre';
                if ($request->type === 'matiere') {
                    // Les enseignants du cours sont modérateurs
                    $user = User::find($participantId);
                    if ($user && $user->hasRole('enseignant')) {
                        $role = 'moderateur';
                    }
                }
                $conversation->ajouterParticipant($participantId, $role);
            }

            DB::commit();
            return response()->json($conversation, 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Erreur lors de la création de la conversation'], 500);
        }
    }

    public function update(Request $request, Conversation $conversation): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$conversation->estParticipant(auth()->id())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $role = $conversation->getRoleUtilisateur(auth()->id());
        if (!in_array($role, ['admin', 'moderateur'])) {
            return response()->json(['message' => 'Permissions insuffisantes'], 403);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'statut' => 'sometimes|in:actif,archive,ferme'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $conversation->update($request->only(['titre', 'description', 'statut']));

        return response()->json($conversation);
    }

    public function ajouterParticipant(Request $request, Conversation $conversation): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $role = $conversation->getRoleUtilisateur(auth()->id());
        if (!in_array($role, ['admin', 'moderateur'])) {
            return response()->json(['message' => 'Permissions insuffisantes'], 403);
        }

        $validator = Validator::make($request->all(), [
            'participant_id' => 'required|exists:users,id',
            'role' => 'sometimes|in:admin,moderateur,membre'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $participantRole = $request->role ?? 'membre';
        $conversation->ajouterParticipant($request->participant_id, $participantRole);

        return response()->json(['message' => 'Participant ajouté avec succès']);
    }

    public function retirerParticipant(Request $request, Conversation $conversation): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $role = $conversation->getRoleUtilisateur(auth()->id());
        if (!in_array($role, ['admin', 'moderateur'])) {
            return response()->json(['message' => 'Permissions insuffisantes'], 403);
        }

        $validator = Validator::make($request->all(), [
            'participant_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $conversation->retirerParticipant($request->participant_id);

        return response()->json(['message' => 'Participant retiré avec succès']);
    }

    public function marquerCommeLue(Conversation $conversation): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$conversation->estParticipant(auth()->id())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Mettre à jour le participant
        $conversation->participants()->updateExistingPivot(auth()->id(), [
            'derniere_lecture' => now(),
            'nombre_messages_non_lus' => 0
        ]);

        return response()->json(['message' => 'Conversation marquée comme lue']);
    }

    public function getConversationsParCours(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $user = auth()->user();
        
        // Récupérer les cours de l'utilisateur
        if ($user->hasRole('etudiant')) {
            $coursIds = $user->coursInscrits()->pluck('cours_id');
        } elseif ($user->hasRole('enseignant')) {
            $coursIds = $user->coursEnseignes()->pluck('cours_id');
        } else {
            $coursIds = [];
        }

        $conversations = Conversation::with(['cours', 'createur'])
            ->visible()
            ->actives()
            ->byType('matiere')
            ->whereIn('cours_id', $coursIds)
            ->pourUtilisateur(auth()->id())
            ->orderBy('dernier_message_date', 'desc')
            ->get();

        // Grouper par cours
        $result = [];
        foreach ($conversations as $conversation) {
            $coursId = $conversation->cours_id;
            if (!isset($result[$coursId])) {
                $result[$coursId] = [
                    'cours' => $conversation->cours,
                    'conversations' => []
                ];
            }
            $conversation->nombre_messages_non_lus = $conversation->getNombreMessagesNonLus(auth()->id());
            $result[$coursId]['conversations'][] = $conversation;
        }

        return response()->json(array_values($result));
    }

    public function destroy(Conversation $conversation): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // Seul le créateur ou un admin peut supprimer
        if ($conversation->createur_id !== auth()->id() && !auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $conversation->update(['statut' => 'ferme']);

        return response()->json(['message' => 'Conversation fermée avec succès']);
    }
}
