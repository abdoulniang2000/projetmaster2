<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreCoursRequest;
use App\Http\Requests\Api\V1\UpdateCoursRequest;
use App\Models\Cours;
use Illuminate\Http\Request;

class CoursController extends Controller
{
    public function __construct()
    {
        \Log::info('CoursController constructeur appelé');
        // $this->authorizeResource(Cours::class, 'cour');
    }

    public function index()
    {
        \Log::info('=== INDEX COURS APPELÉ ===');
        try {
            $cours = Cours::with('enseignant')->get();
            \Log::info('Cours récupérés:', ['count' => $cours->count()]);
            \Log::info('Cours data:', $cours->toArray());
            
            $response = response()->json($cours);
            \Log::info('Response sent:', ['status' => $response->getStatusCode(), 'data_count' => $cours->count()]);
            
            return $response;
        } catch (\Exception $e) {
            \Log::error('Erreur dans index cours:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function enseignantCours()
    {
        \Log::info('=== ENSEIGNANT COURS APPELÉ ===');
        try {
            $cours = Cours::with('enseignant')->get();
            \Log::info('Cours enseignant récupérés:', ['count' => $cours->count()]);
            return response()->json($cours);
        } catch (\Exception $e) {
            \Log::error('Erreur dans enseignant cours:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StoreCoursRequest $request)
    {
        \Log::info('=== DÉBUT STORE COURS ===');
        \Log::info('Request data:', $request->all());
        
        try {
            // Temporairement: créer le cours sans authentification pour tester
            $validated = $request->validated();
            \Log::info('Validated data:', $validated);
            
            // Ajouter un enseignant_id par défaut pour le test
            $validated['enseignant_id'] = 1; // Assurez-vous qu'il y a un utilisateur avec ID 1
            \Log::info('Data with enseignant_id:', $validated);
            
            \Log::info('Creating course...');
            $cours = Cours::create($validated);
            \Log::info('Course created:', $cours->toArray());
            
            \Log::info('=== STORE COURS SUCCESS ===');
            return response()->json($cours, 201);
            
        } catch (\Exception $e) {
            \Log::error('=== STORE COURS ERROR ===');
            \Log::error('Error message:', ['message' => $e->getMessage()]);
            \Log::error('Error file:', ['file' => $e->getFile(), 'line' => $e->getLine()]);
            \Log::error('Error trace:', ['trace' => $e->getTraceAsString()]);
            
            return response()->json([
                'error' => 'Server error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function show(Cours $cour)
    {
        return $cour->load('enseignant', 'modules');
    }

    public function update(UpdateCoursRequest $request, Cours $cour)
    {
        $cour->update($request->validated());
        return response()->json($cour);
    }

    public function destroy(Cours $cour)
    {
        $cour->delete();
        return response()->json(null, 204);
    }
}
