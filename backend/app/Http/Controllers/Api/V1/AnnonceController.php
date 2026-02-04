<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnonceController extends Controller
{
    public function enseignantAnnonces(Request $request)
    {
        $user = $request->user();
        $annonces = Annonce::where('enseignant_id', $user->id)->with(['enseignant', 'cours'])->latest()->get();
        return response()->json($annonces);
    }

    public function index(Request $request)
    {
        $query = Annonce::with(['enseignant', 'cours'])
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
            'type' => 'required|in:general,cours,urgent',
            'cours_id' => 'nullable|exists:cours,id',
            'date_expiration' => 'nullable|date'
        ]);

        $annonce = Annonce::create([
            'titre' => $request->titre,
            'contenu' => $request->contenu,
            'type' => $request->type,
            'cours_id' => $request->type === 'cours' ? $request->cours_id : null,
            'enseignant_id' => Auth::id(),
            'date_publication' => now(),
            'date_expiration' => $request->date_expiration,
            'active' => true
        ]);

        return response()->json($annonce->load('enseignant'), 201);
    }

    public function show(Annonce $annonce)
    {
        return response()->json($annonce->load(['enseignant', 'cours']));
    }

    public function update(Request $request, Annonce $annonce)
    {
        if ($annonce->enseignant_id !== Auth::id() && !Auth::user()->estAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'contenu' => 'sometimes|string',
            'type' => 'sometimes|in:general,cours,urgent',
            'cours_id' => 'nullable|exists:cours,id',
            'date_expiration' => 'nullable|date',
            'active' => 'sometimes|boolean'
        ]);

        $annonce->update($validated);

        return response()->json($annonce->load('enseignant'));
    }

    public function destroy(Annonce $annonce)
    {
        if ($annonce->enseignant_id !== Auth::id() && !Auth::user()->estAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $annonce->delete();

        return response()->json(null, 204);
    }

    public function publish(Annonce $annonce)
    {
        if ($annonce->enseignant_id !== Auth::id() && !Auth::user()->estAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $annonce->update([
            'active' => true,
            'date_publication' => now()
        ]);

        return response()->json($annonce->load('enseignant'));
    }
}
