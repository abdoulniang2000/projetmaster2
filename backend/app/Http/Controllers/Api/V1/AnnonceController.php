<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnonceController extends Controller
{
    public function index(Request $request)
    {
        $query = Annonce::with(['createur', 'cours'])
                       ->active()
                       ->publie()
                       ->latest();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('cours_id')) {
            $query->where('cours_id', $request->cours_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'type' => 'required|in:general,cours,urgence',
            'cours_id' => 'nullable|exists:cours,id'
        ]);

        $annonce = Annonce::create([
            'titre' => $request->titre,
            'contenu' => $request->contenu,
            'type' => $request->type,
            'cours_id' => $request->cours_id,
            'created_by' => Auth::id(),
            'published_at' => now()
        ]);

        return response()->json($annonce->load('createur'), 201);
    }

    public function show(Annonce $annonce)
    {
        return response()->json($annonce->load(['createur', 'cours']));
    }

    public function update(Request $request, Annonce $annonce)
    {
        if ($annonce->created_by !== Auth::id() && !Auth::user()->estAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'type' => 'required|in:general,cours,urgence',
            'is_active' => 'boolean'
        ]);

        $annonce->update($request->all());

        return response()->json($annonce->load('createur'));
    }

    public function destroy(Annonce $annonce)
    {
        if ($annonce->created_by !== Auth::id() && !Auth::user()->estAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $annonce->delete();

        return response()->json(null, 204);
    }

    public function publish(Annonce $annonce)
    {
        if ($annonce->created_by !== Auth::id() && !Auth::user()->estAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $annonce->update([
            'is_active' => true,
            'published_at' => now()
        ]);

        return response()->json($annonce->load('createur'));
    }
}
