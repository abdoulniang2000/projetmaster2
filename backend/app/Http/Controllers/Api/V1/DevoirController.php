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

    public function store(StoreDevoirRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('fichier_joint')) {
            $data['fichier_joint'] = $request->file('fichier_joint')->store('devoirs', 'public');
        }

        $devoir = Devoir::create($data);

        return response()->json($devoir, 201);
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
