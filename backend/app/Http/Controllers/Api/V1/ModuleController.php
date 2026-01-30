<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            \Log::info('ModuleController::index called');
            $modules = Module::all();
            \Log::info('Modules retrieved', ['count' => $modules->count()]);
            
            // Transformer les modules pour inclure le champ 'nom'
            $result = $modules->map(function ($module) {
                return [
                    'id' => $module->id,
                    'nom' => $module->nom, // Utiliser le vrai champ 'nom'
                    'titre' => $module->titre,
                    'contenu' => $module->contenu,
                    'ordre' => $module->ordre,
                    'cours_id' => $module->cours_id,
                    'created_at' => $module->created_at,
                    'updated_at' => $module->updated_at,
                ];
            });
            
            \Log::info('Modules transformed', ['result_count' => $result->count()]);
            return $result;
        } catch (\Exception $e) {
            \Log::error('ModuleController::index error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to retrieve modules'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            \Log::info('ModuleController::store called', ['request_data' => $request->all()]);
            
            // Utiliser le champ 'nom' du frontend
            $nom = $request->input('nom') ?: $request->input('titre');
            
            if (!$nom) {
                \Log::error('Module creation failed: missing nom');
                return response()->json(['error' => 'Le nom du module est requis'], 422);
            }

            \Log::info('Creating module', ['nom' => $nom, 'cours_id' => $request->input('cours_id', 1)]);

            // Créer avec le champ 'nom' ET les autres champs
            $module = Module::create([
                'nom' => $nom, // Insérer dans la colonne 'nom'
                'cours_id' => $request->input('cours_id', 1),
                'titre' => $nom,
                'contenu' => $request->input('contenu', 'Module créé'),
                'ordre' => $request->input('ordre', 1),
            ]);

            \Log::info('Module created successfully', ['module_id' => $module->id, 'module_data' => $module->toArray()]);

            // Retourner avec le champ 'nom' pour compatibilité frontend
            return response()->json([
                'id' => $module->id,
                'nom' => $module->nom, // Utiliser le vrai champ 'nom'
                'titre' => $module->titre,
                'contenu' => $module->contenu,
                'ordre' => $module->ordre,
                'cours_id' => $module->cours_id,
                'created_at' => $module->created_at,
                'updated_at' => $module->updated_at,
            ], 201);
        } catch (\Exception $e) {
            \Log::error('ModuleController::store error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Failed to create module: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Module $module)
    {
        return $module;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Module $module)
    {
        $request->validate([
            'cours_id' => 'sometimes|required|exists:cours,id',
            'titre' => 'sometimes|required|string|max:255',
            'contenu' => 'sometimes|required|string',
            'ordre' => 'sometimes|required|integer',
        ]);

        $module->update($request->all());

        return response()->json($module);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Module $module)
    {
        $module->delete();

        return response()->json(null, 204);
    }
}
