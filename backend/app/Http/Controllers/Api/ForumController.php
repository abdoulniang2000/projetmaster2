<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Forum;
use App\Models\ForumMessage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ForumController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Forum::with(['cours', 'createur'])
            ->visible();

        // Filtrage par catégorie
        if ($request->has('categorie') && $request->categorie !== 'tous') {
            $query->byCategorie($request->categorie);
        }

        // Filtrage par statut
        if ($request->has('statut') && $request->statut !== 'tous') {
            $query->byStatut($request->statut);
        }

        // Filtrage par cours
        if ($request->has('cours_id')) {
            $query->byCours($request->cours_id);
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $forums = $query->orderBy('dernier_message_date', 'desc')->get();

        return response()->json($forums);
    }

    public function show(Forum $forum): JsonResponse
    {
        if (!$forum->visible) {
            return response()->json(['message' => 'Forum non trouvé'], 404);
        }

        $forum->load(['cours', 'createur']);

        return response()->json($forum);
    }

    public function store(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'categorie' => 'required|in:General,Questions techniques,Projets,Examens,Ressources',
            'cours_id' => 'nullable|exists:cours,id',
            'contenu' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $forum = Forum::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'cours_id' => $request->cours_id,
            'createur_id' => auth()->id(),
            'categorie' => $request->categorie,
            'statut' => 'ouvert',
            'nombre_messages' => 0,
            'nombre_participants' => 1,
            'date_creation' => now(),
            'visible' => true
        ]);

        // Créer le premier message
        ForumMessage::create([
            'forum_id' => $forum->id,
            'auteur_id' => auth()->id(),
            'contenu' => $request->contenu,
            'date_creation' => now(),
            'visible' => true
        ]);

        $forum->load(['cours', 'createur']);

        return response()->json($forum, 201);
    }

    public function messages(Forum $forum, Request $request): JsonResponse
    {
        if (!$forum->visible) {
            return response()->json(['message' => 'Forum non trouvé'], 404);
        }

        $query = ForumMessage::with(['auteur'])
            ->where('forum_id', $forum->id)
            ->visible()
            ->racines()
            ->orderBy('date_creation', 'asc');

        $messages = $query->get();

        // Charger les réponses pour chaque message
        $messages->each(function ($message) {
            $message->reponses = ForumMessage::with(['auteur'])
                ->where('parent_id', $message->id)
                ->visible()
                ->orderBy('date_creation', 'asc')
                ->get();
        });

        return response()->json($messages);
    }

    public function addMessage(Forum $forum, Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$forum->visible || $forum->statut === 'ferme') {
            return response()->json(['message' => 'Forum fermé ou non trouvé'], 404);
        }

        $validator = Validator::make($request->all(), [
            'contenu' => 'required|string|max:2000',
            'parent_id' => 'nullable|exists:forum_messages,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérifier que le message parent appartient bien à ce forum
        if ($request->has('parent_id')) {
            $parentMessage = ForumMessage::find($request->parent_id);
            if (!$parentMessage || $parentMessage->forum_id !== $forum->id) {
                return response()->json(['message' => 'Message parent invalide'], 422);
            }
        }

        $message = ForumMessage::create([
            'forum_id' => $forum->id,
            'auteur_id' => auth()->id(),
            'contenu' => $request->contenu,
            'parent_id' => $request->parent_id,
            'date_creation' => now(),
            'visible' => true
        ]);

        $message->load(['auteur']);

        return response()->json($message, 201);
    }

    public function update(Request $request, Forum $forum): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if ($forum->createur_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'statut' => 'sometimes|in:ouvert,ferme,epingle',
            'visible' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $forum->update($request->only(['titre', 'description', 'statut', 'visible']));

        return response()->json($forum);
    }

    public function destroy(Forum $forum): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if ($forum->createur_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Supprimer tous les messages du forum
        $forum->messages()->delete();

        $forum->delete();

        return response()->json(['message' => 'Forum supprimé avec succès']);
    }

    public function likeMessage(ForumMessage $message): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$message->visible) {
            return response()->json(['message' => 'Message non trouvé'], 404);
        }

        $message->incrementerLikes();

        return response()->json([
            'message' => 'Like ajouté',
            'nombre_likes' => $message->fresh()->nombre_likes
        ]);
    }
}
