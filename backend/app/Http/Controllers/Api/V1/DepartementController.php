<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Departement;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    public function index()
    {
        try {
            \Log::info('DepartementController::index called');
            $departements = Departement::all();
            \Log::info('Departements retrieved', ['count' => $departements->count()]);
            return $departements;
        } catch (\Exception $e) {
            \Log::error('DepartementController::index error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to retrieve departements'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            \Log::info('DepartementController::store called', ['request_data' => $request->all()]);
            
            $request->validate([
                'nom' => 'required|string|max:255',
                'code' => 'required|string|max:255|unique:departements,code',
                'description' => 'sometimes|nullable|string',
                'chef_id' => 'sometimes|nullable|exists:users,id'
            ]);

            $departement = Departement::create($request->all());

            \Log::info('Departement created successfully', ['departement_id' => $departement->id]);

            return response()->json($departement, 201);
        } catch (\Exception $e) {
            \Log::error('DepartementController::store error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create departement: ' . $e->getMessage()], 500);
        }
    }

    public function show(Departement $departement)
    {
        return $departement;
    }

    public function update(Request $request, Departement $departement)
    {
        try {
            \Log::info('DepartementController::update called', ['departement_id' => $departement->id, 'request_data' => $request->all()]);
            
            $request->validate([
                'nom' => 'sometimes|required|string|max:255',
                'code' => 'sometimes|required|string|max:255|unique:departements,code,' . $departement->id,
                'description' => 'sometimes|nullable|string',
                'chef_id' => 'sometimes|nullable|exists:users,id'
            ]);

            $departement->update($request->all());

            \Log::info('Departement updated successfully', ['departement_data' => $departement->toArray()]);

            return response()->json($departement);
        } catch (\Exception $e) {
            \Log::error('DepartementController::update error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update departement: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Departement $departement)
    {
        try {
            \Log::info('DepartementController::destroy called', ['departement_id' => $departement->id]);
            
            $departement->delete();

            \Log::info('Departement deleted successfully', ['departement_id' => $departement->id]);

            return response()->json(null, 204);
        } catch (\Exception $e) {
            \Log::error('DepartementController::destroy error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to delete departement: ' . $e->getMessage()], 500);
        }
    }
}
