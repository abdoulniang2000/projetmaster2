<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Support;
use App\Models\Cours;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class SupportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            Log::info('Début de la récupération des supports');
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
            Log::info('Supports récupérés avec succès', ['count' => $supports->count()]);

            return response()->json($supports);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des supports', [
                'error_message' => $e->getMessage(),
                'error_trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la récupération des supports',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCours(): JsonResponse
    {
        Log::info('Récupération de la liste des cours pour le dropdown', [
            'user_id' => auth()->id(),
            'ip' => request()->ip()
        ]);

        try {
            $cours = Cours::query()
                ->select('id', 'nom', 'description')
                ->orderBy('nom', 'asc')
                ->get();

            Log::info('Cours récupérés avec succès', [
                'user_id' => auth()->id(),
                'count' => $cours->count()
            ]);

            return response()->json([
                'success' => true,
                'data' => $cours,
                'count' => $cours->count()
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des cours', [
                'user_id' => auth()->id(),
                'error_message' => $e->getMessage(),
                'error_trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des cours',
                'error' => $e->getMessage()
            ], 500);
        }
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
        Log::info('Tentative de téléchargement de support', [
            'support_id' => $support->id,
            'user_id' => auth()->id(),
            'titre' => $support->titre,
            'ip' => request()->ip()
        ]);

        if (!$support->visible) {
            Log::warning('Tentative de téléchargement de support non visible', [
                'support_id' => $support->id,
                'user_id' => auth()->id(),
                'titre' => $support->titre
            ]);
            return response()->json(['message' => 'Support non trouvé'], 404);
        }

        if (!Storage::exists($support->fichier_path)) {
            Log::error('Fichier de support non trouvé', [
                'support_id' => $support->id,
                'user_id' => auth()->id(),
                'file_path' => $support->fichier_path,
                'titre' => $support->titre
            ]);
            return response()->json(['message' => 'Fichier non disponible'], 404);
        }

        // Incrémenter le compteur de téléchargements
        $support->incrementerTelechargements();

        Log::info('Support téléchargé avec succès', [
            'support_id' => $support->id,
            'user_id' => auth()->id(),
            'titre' => $support->titre,
            'file_path' => $support->fichier_path,
            'download_count' => $support->nombre_telechargements + 1
        ]);

        return response()->json([
            'url' => Storage::url($support->fichier_path),
            'nom' => $support->fichier_nom,
            'taille' => $support->fichier_taille,
            'type' => $support->type
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        Log::info('Début de la méthode store pour support', [
            'user_authenticated' => auth()->check(),
            'user_id' => auth()->id(),
            'headers' => $request->headers->all(),
            'session_driver' => config('session.driver'),
            'sanctum_guard' => config('sanctum.guard')[0] ?? 'web',
            'ip' => $request->ip()
        ]);

        Log::info('Tentative de création de support pédagogique', [
            'user_id' => auth()->id(),
            'titre' => $request->titre,
            'type' => $request->type,
            'cours_id' => $request->cours_id,
            'ip' => $request->ip()
        ]);

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:pdf,ppt,video,image,document',
            'fichier' => 'required|file|max:10240', // 10MB max
            'cours_id' => 'required|exists:cours,id',
            'categorie' => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            Log::warning('Validation échouée pour la création de support', [
                'user_id' => auth()->id(),
                'errors' => $validator->errors()->toArray(),
                'request_data' => $request->except(['fichier'])
            ]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $file = $request->file('fichier');
            
            Log::info('Traitement du fichier de support', [
                'user_id' => auth()->id(),
                'filename' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType()
            ]);

            $path = $file->store('supports', 'public');

            if (!$path) {
                Log::error('Échec du stockage du fichier', [
                    'user_id' => auth()->id(),
                    'filename' => $file->getClientOriginalName()
                ]);
                return response()->json(['message' => 'Erreur lors du stockage du fichier'], 500);
            }

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

            Log::info('Support pédagogique créé avec succès', [
                'support_id' => $support->id,
                'user_id' => auth()->id(),
                'titre' => $support->titre,
                'type' => $support->type,
                'fichier_path' => $support->fichier_path,
                'cours_id' => $support->cours_id
            ]);

            return response()->json($support, 201);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du support pédagogique', [
                'user_id' => auth()->id(),
                'titre' => $request->titre,
                'error_message' => $e->getMessage(),
                'error_trace' => $e->getTraceAsString()
            ]);
            
            return response()->json(['message' => 'Erreur lors de la création du support'], 500);
        }
    }

    public function update(Request $request, Support $support): JsonResponse
    {
        Log::info('Tentative de mise à jour de support', [
            'support_id' => $support->id,
            'user_id' => auth()->id(),
            'instructeur_id' => $support->instructeur_id
        ]);

        if ($support->instructeur_id !== auth()->id()) {
            Log::warning('Tentative de modification non autorisée', [
                'support_id' => $support->id,
                'user_id' => auth()->id(),
                'instructeur_id' => $support->instructeur_id
            ]);
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'categorie' => 'nullable|string|max:100',
            'visible' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            Log::warning('Validation échouée pour la mise à jour de support', [
                'support_id' => $support->id,
                'user_id' => auth()->id(),
                'errors' => $validator->errors()->toArray()
            ]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $oldData = $support->only(['titre', 'description', 'categorie', 'visible']);
        $support->update($request->only(['titre', 'description', 'categorie', 'visible']));

        Log::info('Support mis à jour avec succès', [
            'support_id' => $support->id,
            'user_id' => auth()->id(),
            'old_data' => $oldData,
            'new_data' => $request->only(['titre', 'description', 'categorie', 'visible'])
        ]);

        return response()->json($support);
    }

    public function destroy(Support $support): JsonResponse
    {
        Log::info('Tentative de suppression de support', [
            'support_id' => $support->id,
            'user_id' => auth()->id(),
            'instructeur_id' => $support->instructeur_id,
            'titre' => $support->titre
        ]);

        if ($support->instructeur_id !== auth()->id()) {
            Log::warning('Tentative de suppression non autorisée', [
                'support_id' => $support->id,
                'user_id' => auth()->id(),
                'instructeur_id' => $support->instructeur_id
            ]);
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        try {
            // Supprimer le fichier physique
            if (Storage::exists($support->fichier_path)) {
                Storage::delete($support->fichier_path);
                Log::info('Fichier physique supprimé', [
                    'support_id' => $support->id,
                    'file_path' => $support->fichier_path
                ]);
            } else {
                Log::warning('Fichier physique non trouvé lors de la suppression', [
                    'support_id' => $support->id,
                    'file_path' => $support->fichier_path
                ]);
            }

            $support->delete();

            Log::info('Support supprimé avec succès', [
                'support_id' => $support->id,
                'user_id' => auth()->id(),
                'titre' => $support->titre
            ]);

            return response()->json(['message' => 'Support supprimé avec succès']);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du support', [
                'support_id' => $support->id,
                'user_id' => auth()->id(),
                'error_message' => $e->getMessage()
            ]);
            
            return response()->json(['message' => 'Erreur lors de la suppression du support'], 500);
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

    public function logCancel(Request $request): JsonResponse
    {
        Log::info('Annulation de l\'ajout d\'un support pédagogique', [
            'user_id' => auth()->id(),
            'ip' => $request->ip()
        ]);

        return response()->json(['message' => 'Annulation enregistrée']);
    }
}
