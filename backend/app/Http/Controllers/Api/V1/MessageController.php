<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreMessageRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::id();
        $query = Message::with(['expediteur', 'destinataire', 'groupe', 'fichiers']);

        // Messages reçus par défaut
        if ($request->has('type') && $request->type === 'sent') {
            $query->where('expediteur_id', $user);
        } else {
            $query->where('destinataire_id', $user);
        }

        // Filtres
        if ($request->has('urgent')) {
            $query->urgent();
        }

        if ($request->has('non_lu')) {
            $query->nonLu();
        }

        if ($request->has('tag')) {
            $query->parTag($request->tag);
        }

        if ($request->has('groupe_id')) {
            $query->where('groupe_id', $request->groupe_id);
        }

        // Grouper les messages par conversation si ce n'est pas un message de groupe
        if (!$request->has('groupe_id')) {
            $messages = $query->latest()->get();
            $conversations = $messages->groupBy(function ($message) use ($user) {
                return $message->expediteur_id === $user ? $message->destinataire_id : $message->expediteur_id;
            });
            return response()->json($conversations);
        }

        return response()->json($query->latest()->get());
    }

    public function show(User $user, Request $request)
    {
        $authUserId = Auth::id();
        $otherUserId = $user->id;

        $messages = Message::where(function ($query) use ($authUserId, $otherUserId) {
            $query->where('expediteur_id', $authUserId)->where('destinataire_id', $otherUserId);
        })->orWhere(function ($query) use ($authUserId, $otherUserId) {
            $query->where('expediteur_id', $otherUserId)->where('destinataire_id', $authUserId);
        })
        ->with(['expediteur', 'destinataire', 'fichiers'])
        ->orderBy('created_at', 'asc')
        ->get();

        // Marquer les messages comme lus
        Message::where('expediteur_id', $otherUserId)
               ->where('destinataire_id', $authUserId)
               ->where('is_read', false)
               ->update([
                   'is_read' => true,
                   'read_at' => now()
               ]);

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'destinataire_id' => 'required_without:groupe_id|exists:users,id',
            'groupe_id' => 'required_without:destinataire_id|exists:cours,id',
            'sujet' => 'nullable|string|max:255',
            'contenu' => 'required|string',
            'is_urgent' => 'boolean',
            'tags' => 'array',
            'tags.*' => 'string|max:50'
        ]);

        $message = Message::create([
            'expediteur_id' => Auth::id(),
            'destinataire_id' => $request->destinataire_id,
            'groupe_id' => $request->groupe_id,
            'sujet' => $request->sujet,
            'contenu' => $request->contenu,
            'is_urgent' => $request->is_urgent ?? false,
            'tags' => $request->tags ?? []
        ]);

        // Envoyer notification
        if ($request->destinataire_id) {
            \App\Models\Notification::create([
                'type' => 'message',
                'titre' => 'Nouveau message',
                'contenu' => $request->sujet ?? 'Vous avez reçu un nouveau message',
                'notifiable_type' => \App\Models\User::class,
                'notifiable_id' => $request->destinataire_id,
                'metadonnees' => ['message_id' => $message->id]
            ]);
        }

        return response()->json($message->load(['expediteur', 'destinataire', 'groupe']), 201);
    }

    public function markAsRead(Message $message)
    {
        $user = Auth::id();
        
        if ($message->destinataire_id !== $user) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $message->marquerCommeLu();

        return response()->json($message);
    }

    public function markAllAsRead()
    {
        $user = Auth::id();
        
        Message::where('destinataire_id', $user)
               ->where('is_read', false)
               ->update([
                   'is_read' => true,
                   'read_at' => now()
               ]);

        return response()->json(['message' => 'Tous les messages marqués comme lus']);
    }

    public function getUnreadCount()
    {
        $user = Auth::id();
        $count = Message::where('destinataire_id', $user)
                       ->where('is_read', false)
                       ->count();

        return response()->json(['count' => $count]);
    }

    // Messages de groupe (par cours)
    public function getGroupMessages($coursId)
    {
        // Vérifier que l'utilisateur a accès au cours
        $user = Auth::user();
        $cours = \App\Models\Cours::findOrFail($coursId);
        
        if (!$user->estAdmin() && 
            $cours->enseignant_id !== $user->id && 
            !$cours->etudiantsInscrits()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $messages = Message::where('groupe_id', $coursId)
                           ->with(['expediteur', 'fichiers'])
                           ->latest()
                           ->get();

        return response()->json($messages);
    }

    public function sendGroupMessage(Request $request, $coursId)
    {
        // Vérifier que l'utilisateur a accès au cours
        $user = Auth::user();
        $cours = \App\Models\Cours::findOrFail($coursId);
        
        if (!$user->estAdmin() && 
            $cours->enseignant_id !== $user->id && 
            !$cours->etudiantsInscrits()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $request->validate([
            'sujet' => 'nullable|string|max:255',
            'contenu' => 'required|string',
            'is_urgent' => 'boolean',
            'tags' => 'array',
            'tags.*' => 'string|max:50'
        ]);

        $message = Message::create([
            'expediteur_id' => $user->id,
            'groupe_id' => $coursId,
            'sujet' => $request->sujet,
            'contenu' => $request->contenu,
            'is_urgent' => $request->is_urgent ?? false,
            'tags' => $request->tags ?? []
        ]);

        // Notifier tous les membres du cours
        $membres = $cours->etudiantsInscrits;
        if ($cours->enseignant_id !== $user->id) {
            $membres->push($cours->enseignant);
        }

        foreach ($membres as $membre) {
            if ($membre->id !== $user->id) {
                \App\Models\Notification::create([
                    'type' => 'message_groupe',
                    'titre' => 'Nouveau message dans ' . $cours->nom,
                    'contenu' => $request->sujet ?? $request->contenu,
                    'notifiable_type' => \App\Models\User::class,
                    'notifiable_id' => $membre->id,
                    'metadonnees' => ['message_id' => $message->id, 'cours_id' => $coursId]
                ]);
            }
        }

        return response()->json($message->load(['expediteur', 'groupe']), 201);
    }
}
