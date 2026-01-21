<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Devoir;
use App\Models\Soumission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class SoumissionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $validator = Validator::make($request->all(), [
            'devoir_id' => 'required|exists:devoirs,id',
            'fichier' => 'required|file|max:10240', // 10MB max
            'commentaire' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $devoir = Devoir::findOrFail($request->devoir_id);

        // Vérifier si le devoir est encore ouvert
        if (now()->gt($devoir->date_limite)) {
            return response()->json(['message' => 'La date limite est dépassée'], 422);
        }

        // Vérifier si l'étudiant est inscrit au cours
        $user = auth()->user();
        if (!$user->coursInscrits()->where('cours_id', $devoir->cours_id)->exists()) {
            return response()->json(['message' => 'Vous n\'êtes pas inscrit à ce cours'], 403);
        }

        $file = $request->file('fichier');
        $path = $file->store('soumissions', 'public');

        $soumission = Soumission::create([
            'devoir_id' => $request->devoir_id,
            'etudiant_id' => $user->id,
            'fichier_path' => $path,
            'fichier_nom' => $file->getClientOriginalName(),
            'fichier_taille' => $this->formatFileSize($file->getSize()),
            'commentaire' => $request->commentaire,
            'statut' => 'en_attente',
            'date_soumission' => now()
        ]);

        return response()->json($soumission, 201);
    }

    public function mesSoumissions(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $query = Soumission::with(['devoir.cours', 'correcteur'])
            ->where('etudiant_id', auth()->id());

        // Filtrage par statut
        if ($request->has('statut') && $request->statut !== 'tous') {
            $query->byStatut($request->statut);
        }

        // Filtrage par devoir
        if ($request->has('devoir_id')) {
            $query->byDevoir($request->devoir_id);
        }

        $soumissions = $query->orderBy('date_soumission', 'desc')->get();

        return response()->json($soumissions);
    }

    public function show(Soumission $soumission): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // Vérifier que c'est la soumission de l'utilisateur connecté
        if ($soumission->etudiant_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $soumission->load(['devoir.cours', 'correcteur']);

        return response()->json($soumission);
    }

    public function download(Soumission $soumission): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // Vérifier que c'est la soumission de l'utilisateur connecté
        if ($soumission->etudiant_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if (!Storage::exists($soumission->fichier_path)) {
            return response()->json(['message' => 'Fichier non trouvé'], 404);
        }

        return response()->json([
            'url' => Storage::url($soumission->fichier_path),
            'nom' => $soumission->fichier_nom,
            'taille' => $soumission->fichier_taille,
            'version' => $soumission->version,
            'date_soumission' => $soumission->date_soumission
        ]);
    }

    public function update(Request $request, Soumission $soumission): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // Vérifier que c'est la soumission de l'utilisateur connecté
        if ($soumission->etudiant_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Vérifier que la soumission n'est pas encore corrigée
        if ($soumission->statut === 'corrige') {
            return response()->json(['message' => 'Cette soumission est déjà corrigée'], 422);
        }

        // Vérifier que le devoir est encore ouvert
        if (now()->gt($soumission->devoir->date_limite)) {
            return response()->json(['message' => 'La date limite est dépassée'], 422);
        }

        $validator = Validator::make($request->all(), [
            'fichier' => 'required|file|max:10240',
            'commentaire' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Supprimer l'ancien fichier
        if (Storage::exists($soumission->fichier_path)) {
            Storage::delete($soumission->fichier_path);
        }

        $file = $request->file('fichier');
        $path = $file->store('soumissions', 'public');

        $soumission->update([
            'fichier_path' => $path,
            'fichier_nom' => $file->getClientOriginalName(),
            'fichier_taille' => $this->formatFileSize($file->getSize()),
            'commentaire' => $request->commentaire,
            'statut' => 'en_attente',
            'date_soumission' => now()
        ]);

        return response()->json($soumission);
    }

    public function destroy(Soumission $soumission): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // Vérifier que c'est la soumission de l'utilisateur connecté
        if ($soumission->etudiant_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Vérifier que la soumission n'est pas encore corrigée
        if ($soumission->statut === 'corrige') {
            return response()->json(['message' => 'Impossible de supprimer une soumission corrigée'], 422);
        }

        // Supprimer le fichier physique
        if (Storage::exists($soumission->fichier_path)) {
            Storage::delete($soumission->fichier_path);
        }

        $soumission->delete();

        return response()->json(['message' => 'Soumission supprimée avec succès']);
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
