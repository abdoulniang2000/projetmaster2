<?php

namespace App\Http\Controllers\Api\Messagerie;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\MessageTag;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function index(Request $request, Conversation $conversation): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$conversation->estParticipant(auth()->id())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $query = $conversation->messages()
            ->with(['expediteur', 'tags'])
            ->visible()
            ->chronologique();

        // Pagination
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 50);
        
        $messages = $query->paginate($limit, ['*'], 'page', $page);

        return response()->json($messages);
    }

    public function store(Request $request, Conversation $conversation): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$conversation->estParticipant(auth()->id())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'contenu' => 'required_without:fichier|string|max:2000',
            'type' => 'required_without:fichier|in:texte,fichier,image,lien',
            'fichier' => 'required_without:contenu|file|max:10240', // 10MB max
            'lien_url' => 'required_if:type,lien|url',
            'lien_titre' => 'required_if:type,lien|string|max:255',
            'tags' => 'array',
            'tags.*' => 'string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'conversation_id' => $conversation->id,
            'expediteur_id' => auth()->id(),
            'type' => $request->type ?? 'texte',
            'date_envoi' => now(),
            'visible' => true
        ];

        // Gérer le contenu selon le type
        if ($request->hasFile('fichier')) {
            $file = $request->file('fichier');
            $path = $file->store('messages/fichiers', 'public');
            
            $data['fichier_path'] = $path;
            $data['fichier_nom'] = $file->getClientOriginalName();
            $data['fichier_taille'] = $this->formatFileSize($file->getSize());
            $data['contenu'] = $request->contenu ?? "📎 Fichier partagé: " . $file->getClientOriginalName();
            $data['type'] = $this->getFileType($file->getClientOriginalExtension());
        } elseif ($request->type === 'lien') {
            $data['lien_url'] = $request->lien_url;
            $data['lien_titre'] = $request->lien_titre;
            $data['contenu'] = "🔗 Lien partagé: " . $request->lien_titre;
        } else {
            $data['contenu'] = $request->contenu;
        }

        $message = Message::create($data);

        // Ajouter les tags
        if ($request->has('tags')) {
            foreach ($request->tags as $tag) {
                $couleur = MessageTag::getCouleurTag($tag);
                $message->ajouterTag($tag, auth()->id(), $couleur);
            }
        }

        // Charger les relations pour la réponse
        $message->load(['expediteur', 'tags']);

        return response()->json($message, 201);
    }

    public function show(Message $message): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$message->conversation->estParticipant(auth()->id())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $message->load(['expediteur', 'tags', 'conversation']);

        return response()->json($message);
    }

    public function update(Request $request, Message $message): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if ($message->expediteur_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Vérifier que le message n'est pas trop vieux (ex: 15 minutes)
        if ($message->date_envoi->diffInMinutes(now()) > 15) {
            return response()->json(['message' => 'Le message ne peut plus être modifié'], 422);
        }

        $validator = Validator::make($request->all(), [
            'contenu' => 'required|string|max:2000'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $message->editer($request->contenu);
        $message->load(['expediteur', 'tags']);

        return response()->json($message);
    }

    public function destroy(Message $message): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if ($message->expediteur_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $message->supprimer();

        return response()->json(['message' => 'Message supprimé']);
    }

    public function ajouterTag(Request $request, Message $message): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$message->conversation->estParticipant(auth()->id())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'tag' => 'required|string|max:50',
            'couleur' => 'sometimes|string|max:7'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tag = $request->tag;
        if (!str_starts_with($tag, '#')) {
            $tag = '#' . $tag;
        }

        $couleur = $request->couleur ?? MessageTag::getCouleurTag($tag);

        // Vérifier si le tag existe déjà
        if ($message->tags()->where('tag', $tag)->where('user_id', auth()->id())->exists()) {
            return response()->json(['message' => 'Ce tag existe déjà'], 422);
        }

        $message->ajouterTag($tag, auth()->id(), $couleur);
        $message->load(['expediteur', 'tags']);

        return response()->json($message);
    }

    public function supprimerTag(Request $request, Message $message): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $validator = Validator::make($request->all(), [
            'tag' => 'required|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tag = $request->tag;
        if (!str_starts_with($tag, '#')) {
            $tag = '#' . $tag;
        }

        $messageTag = $message->tags()
            ->where('tag', $tag)
            ->where('user_id', auth()->id())
            ->first();

        if (!$messageTag) {
            return response()->json(['message' => 'Tag non trouvé'], 404);
        }

        $messageTag->delete();
        $message->load(['expediteur', 'tags']);

        return response()->json($message);
    }

    public function rechercherTags(): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $tags = MessageTag::tagsPredefinis()
            ->select('tag', 'couleur')
            ->distinct()
            ->get();

        return response()->json($tags);
    }

    public function getMessagesParTag(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $validator = Validator::make($request->all(), [
            'tag' => 'required|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tag = $request->tag;
        if (!str_starts_with($tag, '#')) {
            $tag = '#' . $tag;
        }

        $messages = Message::with(['expediteur', 'conversation', 'tags'])
            ->whereHas('tags', function ($query) use ($tag) {
                $query->where('tag', $tag);
            })
            ->whereHas('conversation', function ($query) {
                $query->pourUtilisateur(auth()->id());
            })
            ->visible()
            ->recent()
            ->paginate(50);

        return response()->json($messages);
    }

    public function telechargerFichier(Message $message): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$message->conversation->estParticipant(auth()->id())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($message->type !== 'fichier' || !$message->fichier_path) {
            return response()->json(['message' => 'Fichier non disponible'], 404);
        }

        if (!Storage::exists($message->fichier_path)) {
            return response()->json(['message' => 'Fichier non trouvé'], 404);
        }

        return response()->json([
            'url' => Storage::url($message->fichier_path),
            'nom' => $message->fichier_nom,
            'taille' => $message->fichier_taille
        ]);
    }

    private function getFileType($extension): string
    {
        $extension = strtolower($extension);
        
        $images = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        $documents = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
        
        if (in_array($extension, $images)) {
            return 'image';
        } elseif (in_array($extension, $documents)) {
            return 'fichier';
        } else {
            return 'fichier';
        }
    }

    private function formatFileSize($bytes): string
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }
}
