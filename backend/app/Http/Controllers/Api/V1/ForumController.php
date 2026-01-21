<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Forum;
use App\Models\Discussion;
use App\Models\Reponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForumController extends Controller
{
    public function index(Request $request)
    {
        $query = Forum::with(['createur', 'cours', 'discussions' => function($q) {
            $q->with('user')->latest();
        }])->actif();

        if ($request->has('cours_id')) {
            $query->where('cours_id', $request->cours_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'cours_id' => 'nullable|exists:cours,id'
        ]);

        $forum = Forum::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'cours_id' => $request->cours_id,
            'created_by' => Auth::id()
        ]);

        return response()->json($forum->load('createur'), 201);
    }

    public function show(Forum $forum)
    {
        $forum->load(['createur', 'cours', 'discussions' => function($q) {
            $q->with(['user', 'reponses' => function($rq) {
                $rq->with('user')->latest();
            }])->latest();
        }]);

        return response()->json($forum);
    }

    public function update(Request $request, Forum $forum)
    {
        if ($forum->created_by !== Auth::id() && !Auth::user()->estAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'is_active' => 'boolean'
        ]);

        $forum->update($request->all());

        return response()->json($forum->load('createur'));
    }

    public function destroy(Forum $forum)
    {
        if ($forum->created_by !== Auth::id() && !Auth::user()->estAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $forum->delete();

        return response()->json(null, 204);
    }

    // Discussions
    public function storeDiscussion(Request $request, Forum $forum)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string'
        ]);

        $discussion = Discussion::create([
            'titre' => $request->titre,
            'contenu' => $request->contenu,
            'forum_id' => $forum->id,
            'user_id' => Auth::id()
        ]);

        return response()->json($discussion->load('user'), 201);
    }

    // Réponses
    public function storeReponse(Request $request, Discussion $discussion)
    {
        $request->validate([
            'contenu' => 'required|string'
        ]);

        $reponse = Reponse::create([
            'contenu' => $request->contenu,
            'discussion_id' => $discussion->id,
            'user_id' => Auth::id()
        ]);

        return response()->json($reponse->load('user'), 201);
    }

    public function markBestAnswer(Reponse $reponse)
    {
        $discussion = $reponse->discussion;
        
        if ($discussion->user_id !== Auth::id() && !Auth::user()->estAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        // Marquer toutes les réponses comme non meilleures
        $discussion->reponses()->update(['is_best_answer' => false]);
        
        // Marquer cette réponse comme la meilleure
        $reponse->update(['is_best_answer' => true]);

        return response()->json($reponse->load('user'));
    }
}
