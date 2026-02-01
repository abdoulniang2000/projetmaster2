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
        // Log de début de création de conversation
        \Log::info('=== DÉBUT CRÉATION CONVERSATION ===', [
            'user_id' => auth()->id(),
            'user_email' => auth()->user()?->email,
            'request_data' => $request->all(),
            'timestamp' => now()->toDateTimeString()
        ]);

        if (!auth()->check()) {
            \Log::warning('Tentative de création de conversation non authentifiée', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        \Log::info('Utilisateur authentifié', [
            'user_id' => auth()->id(),
            'user_email' => auth()->user()->email
        ]);

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'type' => 'required|in:prive,groupe,matiere',
            'cours_id' => 'nullable|exists:cours,id',
            'participants' => 'required|array|min:1',
            'participants.*' => 'exists:users,id|distinct'
        ], [
            'participants.*.distinct' => 'Les participants doivent être uniques',
            'titre.max' => 'Le titre ne doit pas dépasser 255 caractères',
            'description.max' => 'La description ne doit pas dépasser 1000 caractères'
        ]);

        if ($validator->fails()) {
            \Log::warning('Validation échouée pour création conversation', [
                'user_id' => auth()->id(),
                'errors' => $validator->errors()->toArray(),
                'request_data' => $request->all()
            ]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        \Log::info('Validation réussie', [
            'type' => $request->type,
            'titre' => $request->titre,
            'participants_count' => count($request->participants)
        ]);

        // Validation spécifique selon le type
        if ($request->type === 'matiere' && !$request->cours_id) {
            \Log::warning('Conversation matière sans cours_id', [
                'user_id' => auth()->id(),
                'request_data' => $request->all()
            ]);
            return response()->json(['message' => 'Le cours_id est requis pour les conversations de matière'], 422);
        }

        if ($request->type === 'prive' && count($request->participants) !== 1) {
            \Log::warning('Conversation privée avec nombre de participants incorrect', [
                'user_id' => auth()->id(),
                'participants_count' => count($request->participants),
                'participants' => $request->participants
            ]);
            return response()->json(['message' => 'Une conversation privée doit avoir exactement un participant'], 422);
        }

        // Vérifier que le créateur n'est pas dans la liste des participants
        if (in_array(auth()->id(), $request->participants)) {
            \Log::warning('Créateur essaye de s\'ajouter comme participant', [
                'user_id' => auth()->id(),
                'participants' => $request->participants
            ]);
            return response()->json(['message' => 'Vous ne pouvez pas vous ajouter comme participant'], 422);
        }

        // Vérifier si une conversation privée existe déjà entre ces deux utilisateurs
        if ($request->type === 'prive') {
            \Log::info('Vérification conversation privée existante', [
                'user_id' => auth()->id(),
                'participant_id' => $request->participants[0]
            ]);
            
            $existingConversation = Conversation::where('type', 'prive')
                ->whereHas('participants', function ($query) {
                    $query->where('user_id', auth()->id());
                })
                ->whereHas('participants', function ($query) use ($request) {
                    $query->where('user_id', $request->participants[0]);
                })
                ->where('statut', 'actif')
                ->first();

            if ($existingConversation) {
                \Log::info('Conversation privée existante trouvée', [
                    'user_id' => auth()->id(),
                    'participant_id' => $request->participants[0],
                    'existing_conversation_id' => $existingConversation->id
                ]);
                return response()->json([
                    'message' => 'Une conversation privée existe déjà avec cet utilisateur',
                    'conversation' => $existingConversation->load(['participants'])
                ], 409);
            }
        }

        DB::beginTransaction();
        try {
            \Log::info('Début transaction DB - Création conversation', [
                'user_id' => auth()->id(),
                'type' => $request->type,
                'titre' => $request->titre
            ]);

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

            \Log::info('Conversation créée avec succès', [
                'conversation_id' => $conversation->id,
                'titre' => $conversation->titre,
                'type' => $conversation->type
            ]);

            // Ajouter le créateur comme admin
            $conversation->ajouterParticipant(auth()->id(), 'admin');
            \Log::info('Créateur ajouté comme admin', [
                'conversation_id' => $conversation->id,
                'createur_id' => auth()->id()
            ]);

            // Ajouter les autres participants avec rôles appropriés
            foreach ($request->participants as $index => $participantId) {
                \Log::info('Ajout participant', [
                    'conversation_id' => $conversation->id,
                    'participant_id' => $participantId,
                    'index' => $index
                ]);
                
                $role = $this->determineParticipantRole($participantId, $request->type, $request->cours_id);
                $conversation->ajouterParticipant($participantId, $role);
                
                \Log::info('Participant ajouté avec succès', [
                    'conversation_id' => $conversation->id,
                    'participant_id' => $participantId,
                    'role' => $role
                ]);
            }

            // Créer un message de bienvenue pour les conversations de groupe et matière
            if (in_array($request->type, ['groupe', 'matiere'])) {
                \Log::info('Création message de bienvenue', [
                    'conversation_id' => $conversation->id,
                    'type' => $request->type
                ]);
                
                $message = $this->createWelcomeMessage($conversation, auth()->user());
                
                \Log::info('Message de bienvenue créé', [
                    'conversation_id' => $conversation->id,
                    'message_id' => $message->id
                ]);
            }

            DB::commit();
            \Log::info('Transaction DB validée avec succès', [
                'conversation_id' => $conversation->id,
                'user_id' => auth()->id()
            ]);
            
            // Charger les relations pour la réponse
            $conversation->load(['cours', 'createur', 'participants']);
            
            \Log::info('=== CONVERSATION CRÉÉE AVEC SUCCÈS ===', [
                'conversation_id' => $conversation->id,
                'user_id' => auth()->id(),
                'type' => $conversation->type,
                'participants_count' => $conversation->participants->count(),
                'timestamp' => now()->toDateTimeString()
            ]);
            
            return response()->json([
                'message' => 'Conversation créée avec succès',
                'conversation' => $conversation
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollback();
            
            \Log::error('=== ERREUR CRÉATION CONVERSATION ===', [
                'error_message' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'error_trace' => $e->getTraceAsString(),
                'user_id' => auth()->id(),
                'request_data' => $request->all(),
                'timestamp' => now()->toDateTimeString()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors de la création de la conversation',
                'debug_info' => config('app.debug') ? [
                    'error' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ] : null
            ], 500);
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

    /**
     * Détermine le rôle d'un participant en fonction du contexte
     */
    private function determineParticipantRole(int $userId, string $conversationType, ?int $coursId = null): string
    {
        \Log::info('Détermination rôle participant', [
            'user_id' => $userId,
            'conversation_type' => $conversationType,
            'cours_id' => $coursId
        ]);
        
        $user = User::find($userId);
        
        if (!$user) {
            \Log::warning('Utilisateur non trouvé pour attribution rôle', ['user_id' => $userId]);
            return 'membre';
        }

        // Pour les conversations de matière, les enseignants du cours sont modérateurs
        if ($conversationType === 'matiere' && $coursId) {
            $cours = Cours::find($coursId);
            if ($cours && $cours->enseignant_id === $userId) {
                \Log::info('Rôle modérateur attribué (enseignant du cours)', [
                    'user_id' => $userId,
                    'cours_id' => $coursId
                ]);
                return 'moderateur';
            }
        }

        // Les administrateurs système sont toujours admin
        if ($user->hasRole('admin')) {
            \Log::info('Rôle admin attribué (admin système)', ['user_id' => $userId]);
            return 'admin';
        }

        \Log::info('Rôle membre attribué par défaut', ['user_id' => $userId]);
        return 'membre';
    }

    /**
     * Crée un message de bienvenue pour les nouvelles conversations
     */
    private function createWelcomeMessage(Conversation $conversation, User $creator): Message
    {
        \Log::info('Création message de bienvenue', [
            'conversation_id' => $conversation->id,
            'conversation_type' => $conversation->type,
            'creator_id' => $creator->id
        ]);
        
        switch ($conversation->type) {
            case 'groupe':
                $welcomeText = "👋 Bienvenue dans le groupe '{$conversation->titre}' !\n\nCette conversation a été créée par {$creator->name}.";
                break;
            case 'matiere':
                $welcomeText = "📚 Conversation de matière : {$conversation->titre}\n\nBienvenue ! Cette conversation est liée à la matière {$conversation->cours->titre}.";
                break;
            default:
                $welcomeText = "Conversation créée avec succès.";
                break;
        }

        try {
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'expediteur_id' => $creator->id,
                'contenu' => $welcomeText,
                'type' => 'systeme',
                'date_envoi' => now()
            ]);
            
            \Log::info('Message de bienvenue créé avec succès', [
                'message_id' => $message->id,
                'conversation_id' => $conversation->id
            ]);
            
            return $message;
        } catch (\Exception $e) {
            \Log::error('Erreur création message de bienvenue', [
                'error' => $e->getMessage(),
                'conversation_id' => $conversation->id,
                'creator_id' => $creator->id
            ]);
            throw $e;
        }
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
