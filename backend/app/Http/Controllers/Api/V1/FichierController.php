<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Fichier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class FichierController extends Controller
{
    public function index(Request $request)
    {
        $query = Fichier::with(['uploader', 'fichierable']);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('fichierable_type') && $request->has('fichierable_id')) {
            $query->where('fichierable_type', $request->fichierable_type)
                  ->where('fichierable_id', $request->fichierable_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'fichier' => 'required|file|max:10240',
            'fichierable_type' => 'required|string',
            'fichierable_id' => 'required|integer'
        ]);

        $file = $request->file('fichier');
        $path = $file->store('fichiers', 'public');

        $fichier = Fichier::create([
            'nom' => $file->getClientOriginalName(),
            'chemin' => $path,
            'type' => $file->getMimeType(),
            'taille' => $file->getSize(),
            'fichierable_type' => $request->fichierable_type,
            'fichierable_id' => $request->fichierable_id,
            'uploaded_by' => Auth::id()
        ]);

        return response()->json($fichier->load('uploader'), 201);
    }

    public function show(Fichier $fichier)
    {
        return response()->json($fichier->load(['uploader', 'fichierable']));
    }

    public function download(Fichier $fichier)
    {
        if (!Storage::disk('public')->exists($fichier->chemin)) {
            return response()->json(['error' => 'Fichier non trouvé'], 404);
        }

        return Storage::disk('public')->download($fichier->chemin, $fichier->nom);
    }

    public function destroy(Fichier $fichier)
    {
        if ($fichier->uploaded_by !== Auth::id() && !Auth::user()->estAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        Storage::disk('public')->delete($fichier->chemin);
        $fichier->delete();

        return response()->json(null, 204);
    }
}
