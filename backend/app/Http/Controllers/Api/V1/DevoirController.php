<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreDevoirRequest;
use App\Http\Requests\Api\V1\UpdateDevoirRequest;
use App\Models\Devoir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DevoirController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Devoir::class, 'devoir');
    }

    public function index()
    {
        return Devoir::with('cours')->get();
    }

    public function enseignantDevoirs(Request $request)
    {
        $user = $request->user();
        $coursIds = $user->coursEnseignes()->pluck('id');
        $devoirs = Devoir::whereIn('cours_id', $coursIds)->with('cours')->get();

        return response()->json($devoirs);
    }

    public function store(StoreDevoirRequest $request)
    {
        \Log::info('Début de la création du devoir.');
        try {
            $data = $request->validated();
            \Log::info('Données validées:', $data);

            if ($request->hasFile('fichier_joint')) {
                \Log::info('Téléversement du fichier joint.');
                $data['fichier_joint'] = $request->file('fichier_joint')->store('devoirs', 'public');
                \Log::info('Fichier stocké à l\'adresse: ' . $data['fichier_joint']);
            }

            $devoir = Devoir::create($data);
            \Log::info('Devoir créé avec succès:', ['devoir_id' => $devoir->id]);

            return response()->json($devoir, 201);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création du devoir:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Une erreur est survenue lors de la création du devoir.'], 500);
        }
    }

    public function show(Devoir $devoir)
    {
        return $devoir->load('cours');
    }

    public function update(UpdateDevoirRequest $request, Devoir $devoir)
    {
        $data = $request->validated();

        if ($request->hasFile('fichier_joint')) {
            // Supprimer l'ancien fichier s'il existe
            if ($devoir->fichier_joint) {
                Storage::disk('public')->delete($devoir->fichier_joint);
            }
            $data['fichier_joint'] = $request->file('fichier_joint')->store('devoirs', 'public');
        }

        $devoir->update($data);

        return response()->json($devoir);
    }

    public function destroy(Devoir $devoir)
    {
        if ($devoir->fichier_joint) {
            Storage::disk('public')->delete($devoir->fichier_joint);
        }
        $devoir->delete();

        return response()->json(null, 204);
    }
}
