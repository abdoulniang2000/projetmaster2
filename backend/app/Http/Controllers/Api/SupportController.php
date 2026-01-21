<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Support;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SupportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Support::with(['cours', 'instructeur'])
            ->visible();

        // Filtrage par type
        if ($request->has('type') && $request->type !== 'tous') {
            $query->byType($request->type);
        }

        // Filtrage par catégorie
        if ($request->has('categorie') && $request->categorie !== 'tous') {
            $query->byCategorie($request->categorie);
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

        $supports = $query->orderBy('date_ajout', 'desc')->get();

        return response()->json($supports);
    }

    public function show(Support $support): JsonResponse
    {
        if (!$support->visible) {
            return response()->json(['message' => 'Support non trouvé'], 404);
        }

        $support->load(['cours', 'instructeur']);
        return response()->json($support);
    }

    public function download(Support $support): JsonResponse
    {
        if (!$support->visible || !Storage::exists($support->fichier_path)) {
            return response()->json(['message' => 'Fichier non disponible'], 404);
        }

        // Incrémenter le compteur de téléchargements
        $support->incrementerTelechargements();

        return response()->json([
            'url' => Storage::url($support->fichier_path),
            'nom' => $support->fichier_nom,
            'taille' => $support->fichier_taille,
            'type' => $support->type
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:pdf,ppt,video,image,document',
            'fichier' => 'required|file|max:10240', // 10MB max
            'cours_id' => 'required|exists:cours,id',
            'categorie' => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('fichier');
        $path = $file->store('supports', 'public');

        $support = Support::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'type' => $request->type,
            'fichier_path' => $path,
            'fichier_nom' => $file->getClientOriginalName(),
            'fichier_taille' => $this->formatFileSize($file->getSize()),
            'cours_id' => $request->cours_id,
            'instructeur_id' => auth()->id(),
            'date_ajout' => now(),
            'categorie' => $request->categorie,
            'visible' => true
        ]);

        return response()->json($support, 201);
    }

    public function update(Request $request, Support $support): JsonResponse
    {
        if ($support->instructeur_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'categorie' => 'nullable|string|max:100',
            'visible' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $support->update($request->only(['titre', 'description', 'categorie', 'visible']));

        return response()->json($support);
    }

    public function destroy(Support $support): JsonResponse
    {
        if ($support->instructeur_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Supprimer le fichier physique
        if (Storage::exists($support->fichier_path)) {
            Storage::delete($support->fichier_path);
        }

        $support->delete();

        return response()->json(['message' => 'Support supprimé avec succès']);
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
