<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Devoir;
use App\Models\Soumission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class DevoirController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Devoir::with(['cours', 'instructeur'])
            ->visible();

        // Filtrage par type
        if ($request->has('type') && $request->type !== 'tous') {
            $query->byType($request->type);
        }

        // Filtrage par cours
        if ($request->has('cours_id')) {
            $query->byCours($request->cours_id);
        }

        // Filtrage par statut
        if ($request->has('statut')) {
            if ($request->statut === 'ouvert') {
                $query->where('date_publication', '<=', now())
                      ->where('date_limite', '>', now());
            } elseif ($request->statut === 'expire') {
                $query->where('date_limite', '<', now());
            }
        }

        $devoirs = $query->orderBy('date_publication', 'desc')->get();

        // Ajouter le statut pour chaque devoir
        $devoirs->each(function ($devoir) {
            $devoir->statut = $devoir->getStatutAttribute();
        });

        return response()->json($devoirs);
    }

    public function show(Devoir $devoir): JsonResponse
    {
        if (!$devoir->visible) {
            return response()->json(['message' => 'Devoir non trouvé'], 404);
        }

        $devoir->load(['cours', 'instructeur']);
        $devoir->statut = $devoir->getStatutAttribute();

        // Ajouter les soumissions de l'étudiant connecté
        if (auth()->check()) {
            $soumissions = $devoir->soumissions()
                ->where('etudiant_id', auth()->id())
                ->orderBy('version', 'desc')
                ->get();
            $devoir->mes_soumissions = $soumissions;
        }

        return response()->json($devoir);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:devoir,projet,examen',
            'cours_id' => 'required|exists:cours,id',
            'date_limite' => 'required|date|after:now',
            'ponderation' => 'required|integer|min:1|max:100',
            'instructions' => 'nullable|string',
            'fichier_instructions' => 'nullable|file|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'titre' => $request->titre,
            'description' => $request->description,
            'type' => $request->type,
            'cours_id' => $request->cours_id,
            'instructeur_id' => auth()->id(),
            'date_publication' => now(),
            'date_limite' => $request->date_limite,
            'ponderation' => $request->ponderation,
            'instructions' => $request->instructions,
            'visible' => true
        ];

        // Gérer le fichier d'instructions
        if ($request->hasFile('fichier_instructions')) {
            $file = $request->file('fichier_instructions');
            $path = $file->store('devoirs/instructions', 'public');
            $data['fichier_instructions_path'] = $path;
        }

        $devoir = Devoir::create($data);

        return response()->json($devoir, 201);
    }

    public function update(Request $request, Devoir $devoir): JsonResponse
    {
        if ($devoir->instructeur_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'date_limite' => 'sometimes|date',
            'ponderation' => 'sometimes|integer|min:1|max:100',
            'instructions' => 'nullable|string',
            'visible' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $devoir->update($request->only([
            'titre', 'description', 'date_limite', 'ponderation', 'instructions', 'visible'
        ]));

        return response()->json($devoir);
    }

    public function destroy(Devoir $devoir): JsonResponse
    {
        if ($devoir->instructeur_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Supprimer le fichier d'instructions
        if ($devoir->fichier_instructions_path && Storage::exists($devoir->fichier_instructions_path)) {
            Storage::delete($devoir->fichier_instructions_path);
        }

        $devoir->delete();

        return response()->json(['message' => 'Devoir supprimé avec succès']);
    }

    public function mesDevoirs(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $user = auth()->user();
        
        // Récupérer les cours de l'étudiant
        $coursIds = $user->coursInscrits()->pluck('cours_id');
        
        $devoirs = Devoir::with(['cours', 'instructeur'])
            ->visible()
            ->whereIn('cours_id', $coursIds)
            ->orderBy('date_publication', 'desc')
            ->get();

        // Ajouter le statut et les soumissions
        $devoirs->each(function ($devoir) use ($user) {
            $devoir->statut = $devoir->getStatutAttribute();
            
            $soumissions = $devoir->soumissions()
                ->where('etudiant_id', $user->id)
                ->orderBy('version', 'desc')
                ->get();
            
            $devoir->mes_soumissions = $soumissions;
            $devoir->a_soumis = $soumissions->isNotEmpty();
            $devoir->derniere_soumission = $soumissions->first();
        });

        return response()->json($devoirs);
    }
}
