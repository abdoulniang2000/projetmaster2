<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Semestre;
use Illuminate\Http\Request;

class SemestreController extends Controller
{
    public function index()
    {
        try {
            \Log::info('SemestreController::index called');
            $semestres = Semestre::all();
            \Log::info('Semestres retrieved', ['count' => $semestres->count()]);
            return $semestres;
        } catch (\Exception $e) {
            \Log::error('SemestreController::index error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to retrieve semestres'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            \Log::info('SemestreController::store called', ['request_data' => $request->all()]);
            
            $request->validate([
                'nom' => 'required|string|max:255',
                'date_debut' => 'sometimes|required|date',
                'date_fin' => 'sometimes|required|date|after_or_equal:date_debut',
                'is_active' => 'sometimes|boolean',
            ]);

            \Log::info('Creating semestre', ['nom' => $request->nom]);

            // Créer avec les champs fournis ou valeurs par défaut
            $semestre = Semestre::create([
                'nom' => $request->nom,
                'date_debut' => $request->input('date_debut', now()->format('Y-m-d')),
                'date_fin' => $request->input('date_fin', now()->addMonths(6)->format('Y-m-d')),
                'is_active' => $request->input('is_active', true),
            ]);

            \Log::info('Semestre created successfully', ['semestre_id' => $semestre->id, 'semestre_data' => $semestre->toArray()]);

            return response()->json($semestre, 201);
        } catch (\Exception $e) {
            \Log::error('SemestreController::store error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Failed to create semestre: ' . $e->getMessage()], 500);
        }
    }

    public function show(Semestre $semestre)
    {
        return $semestre;
    }

    public function update(Request $request, Semestre $semestre)
    {
        try {
            \Log::info('SemestreController::update called', ['semestre_id' => $semestre->id, 'request_data' => $request->all()]);
            
            $request->validate([
                'nom' => 'sometimes|required|string|max:255',
                'date_debut' => 'sometimes|required|date',
                'date_fin' => 'sometimes|required|date|after_or_equal:date_debut',
                'is_active' => 'sometimes|required|boolean',
            ]);

            $semestre->update($request->all());

            \Log::info('Semestre updated successfully', ['semestre_data' => $semestre->toArray()]);

            return response()->json($semestre);
        } catch (\Exception $e) {
            \Log::error('SemestreController::update error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update semestre: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Semestre $semestre)
    {
        try {
            \Log::info('SemestreController::destroy called', ['semestre_id' => $semestre->id]);
            
            $semestre->delete();

            \Log::info('Semestre deleted successfully', ['semestre_id' => $semestre->id]);

            return response()->json(null, 204);
        } catch (\Exception $e) {
            \Log::error('SemestreController::destroy error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to delete semestre: ' . $e->getMessage()], 500);
        }
    }
}
