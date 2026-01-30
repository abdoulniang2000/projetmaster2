<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Matiere;
use Illuminate\Http\Request;

class MatiereController extends Controller
{
    public function index()
    {
        return Matiere::all();
    }

    public function store(Request $request)
    {
        try {
            \Log::info('MatiereController::store called', ['request_data' => $request->all()]);
            
            $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'required|string',
                'code' => 'required|string|max:255|unique:matieres,code',
                'departement_id' => 'required|integer|exists:departements,id',
                'credits' => 'sometimes|integer|min:1'
            ]);

            // Créer la matière avec departement_id
            $matiereData = $request->all();
            $matiereData['credits'] = $request->input('credits', 1);
            
            $matiere = Matiere::create($matiereData);

            \Log::info('Matiere created successfully', ['matiere_id' => $matiere->id]);

            return response()->json($matiere, 201);
        } catch (\Exception $e) {
            \Log::error('MatiereController::store error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create matiere: ' . $e->getMessage()], 500);
        }
    }

    public function show(Matiere $matiere)
    {
        return $matiere;
    }

    public function update(Request $request, Matiere $matiere)
    {
        try {
            \Log::info('MatiereController::update called', ['matiere_id' => $matiere->id, 'request_data' => $request->all()]);
            
            $request->validate([
                'nom' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'code' => 'sometimes|required|string|max:255|unique:matieres,code,' . $matiere->id,
                'departement_id' => 'sometimes|required|integer|exists:departements,id',
                'credits' => 'sometimes|integer|min:1'
            ]);

            $matiere->update($request->all());

            \Log::info('Matiere updated successfully', ['matiere_data' => $matiere->toArray()]);

            return response()->json($matiere);
        } catch (\Exception $e) {
            \Log::error('MatiereController::update error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update matiere: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Matiere $matiere)
    {
        $matiere->delete();

        return response()->json(null, 204);
    }
}
