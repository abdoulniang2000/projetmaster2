<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Models\MessageTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $conversations = Conversation::with(['createur', 'cours', 'participants'])
            ->pourUtilisateur($user->id)
            ->actives()
            ->visible()
            ->latest('dernier_message_date')
            ->get();

        // Ajouter les informations supplémentaires
        $conversations->each(function ($conversation) use ($user) {
            $conversation->nombre_messages_non_lus = $conversation->getNombreMessagesNonLus($user->id);
            $conversation->role_utilisateur = $conversation->getRoleUtilisateur($user->id);
        });

        return response()->json($conversations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'type' => 'required|in:prive,groupe,matiere',
            'cours_id' => 'nullable|exists:cours,id',
            'participants' => 'required|array|min:1',
            'participants.*' => 'exists:users,id'
        ]);

        $user = Auth::user();

        // Vérifier les permissions pour les conversations de matière
        if ($request->type === 'matiere' && $request->cours_id) {
            $cours = \App\Models\Cours::find($request->cours_id);
            if (!$user->estAdmin() && $cours->enseignant_id !== $user->id) {
                return response()->json(['error' => 'Non autorisé à créer une conversation pour cette matière'], 403);
            }
        }

        try {
            DB::beginTransaction();

            // Créer la conversation
            $conversation = Conversation::create([
                'titre' => $request->titre,
                'description' => $request->description,
                'type' => $request->type,
                'cours_id' => $request->cours_id,
                'createur_id' => $user->id,
                'statut' => 'actif',
                'visible' => true,
                'nombre_messages' => 0,
                'nombre_participants' => 0
            ]);

            // Ajouter le créateur comme admin
            $conversation->ajouterParticipant($user->id, 'admin');

            // Ajouter les autres participants
            foreach ($request->participants as $participantId) {
                if ($participantId != $user->id) {
                    $role = 'membre';
                    if ($request->type === 'matiere') {
                        $participant = User::find($participantId);
                        if ($participant && $participant->estEnseignant()) {
                            $role = 'enseignant';
                        }
                    }
                    $conversation->ajouterParticipant($participantId, $role);
                }
            }

            DB::commit();

            return response()->json($conversation->load(['createur', 'cours', 'participants']), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erreur lors de la création de la conversation: ' . $e->getMessage()], 500);
        }
    }

    public function show(Conversation $conversation)
    {
        $user = Auth::user();

        // Vérifier que l'utilisateur est participant
        if (!$conversation->estParticipant($user->id)) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $conversation->load(['createur', 'cours', 'participants' => function ($query) {
            $query->where('active', true);
        }]);

        $conversation->nombre_messages_non_lus = $conversation->getNombreMessagesNonLus($user->id);
        $conversation->role_utilisateur = $conversation->getRoleUtilisateur($user->id);

        return response()->json($conversation);
    }

    public function messages(Conversation $conversation, Request $request)
    {
        $user = Auth::user();

        // Vérifier que l'utilisateur est participant
        if (!$conversation->estParticipant($user->id)) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $messages = Message::with(['expediteur', 'tags'])
            ->where('conversation_id', $conversation->id)
            ->visible()
            ->chronologique()
            ->get();

        // Marquer les messages comme lus pour cet utilisateur
        $participant = $conversation->participants()
            ->where('user_id', $user->id)
            ->first();

        if ($participant) {
            $participant->pivot->update([
                'derniere_lecture' => now(),
                'nombre_messages_non_lus' => 0
            ]);
        }

        return response()->json(['data' => $messages]);
    }

    public function sendMessage(Request $request, Conversation $conversation)
    {
        $user = Auth::user();

        // Vérifier que l'utilisateur est participant
        if (!$conversation->estParticipant($user->id)) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $request->validate([
            'contenu' => 'required|string|max:2000',
            'type' => 'required|in:texte,fichier,image,lien',
            'tags' => 'array',
            'tags.*' => 'string|max:50'
        ]);

        try {
            DB::beginTransaction();

            // Créer le message
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'expediteur_id' => $user->id,
                'contenu' => $request->contenu,
                'type' => $request->type,
                'date_envoi' => now(),
                'visible' => true,
                'est_edite' => false,
                'est_supprime' => false
            ]);

            // Ajouter les tags si fournis
            if ($request->tags && is_array($request->tags)) {
                foreach ($request->tags as $tag) {
                    $tag = strtolower(trim($tag));
                    if (str_starts_with($tag, '#')) {
                        $couleur = MessageTag::getCouleurTag($tag);
                        $message->ajouterTag($tag, $user->id, $couleur);
                    }
                }
            }

            DB::commit();

            return response()->json($message->load(['expediteur', 'tags']), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erreur lors de l\'envoi du message: ' . $e->getMessage()], 500);
        }
    }

    public function markAsRead(Conversation $conversation)
    {
        $user = Auth::user();

        // Vérifier que l'utilisateur est participant
        if (!$conversation->estParticipant($user->id)) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $participant = $conversation->participants()
            ->where('user_id', $user->id)
            ->first();

        if ($participant) {
            $participant->pivot->update([
                'derniere_lecture' => now(),
                'nombre_messages_non_lus' => 0
            ]);
        }

        return response()->json(['message' => 'Conversation marquée comme lue']);
    }

    public function addParticipant(Request $request, Conversation $conversation)
    {
        $user = Auth::user();

        // Vérifier que l'utilisateur est admin ou créateur
        $role = $conversation->getRoleUtilisateur($user->id);
        if (!in_array($role, ['admin', 'createur'])) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'nullable|in:membre,enseignant,admin'
        ]);

        $participantRole = $request->role ?? 'membre';
        $conversation->ajouterParticipant($request->user_id, $participantRole);

        return response()->json(['message' => 'Participant ajouté avec succès']);
    }

    public function removeParticipant(Request $request, Conversation $conversation)
    {
        $user = Auth::user();

        // Vérifier que l'utilisateur est admin ou créateur
        $role = $conversation->getRoleUtilisateur($user->id);
        if (!in_array($role, ['admin', 'createur'])) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $conversation->retirerParticipant($request->user_id);

        return response()->json(['message' => 'Participant retiré avec succès']);
    }

    public function getConversationsByMatiere($matiereId)
    {
        $user = Auth::user();

        $conversations = Conversation::with(['createur', 'cours'])
            ->whereHas('cours', function ($query) use ($matiereId) {
                $query->where('matiere_id', $matiereId);
            })
            ->pourUtilisateur($user->id)
            ->actives()
            ->visible()
            ->latest('dernier_message_date')
            ->get();

        return response()->json($conversations);
    }

    public function getTagsPredefinis()
    {
        return response()->json(MessageTag::getTagsPredefinis());
    }

    public function searchByTag($tag)
    {
        $user = Auth::user();

        $messages = Message::with(['conversation', 'expediteur', 'tags'])
            ->whereHas('tags', function ($query) use ($tag) {
                $query->where('tag', $tag);
            })
            ->whereHas('conversation', function ($query) use ($user) {
                $query->pourUtilisateur($user->id);
            })
            ->visible()
            ->latest('date_envoi')
            ->get();

        return response()->json($messages);
    }
}
