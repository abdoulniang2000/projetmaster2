<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreSoumissionRequest;
use App\Models\Devoir;
use App\Models\Soumission;
use Illuminate\Http\Request;

class SoumissionController extends Controller
{
    public function index(Devoir $devoir)
    {
        $this->authorize('viewAny', [Soumission::class, $devoir]);
        return $devoir->soumissions()->with('etudiant')->get();
    }

    public function store(StoreSoumissionRequest $request, Devoir $devoir)
    {
        $this->authorize('create', [Soumission::class, $devoir]);

        $filePath = $request->file('fichier_soumis')->store('soumissions', 'public');

        $soumission = $devoir->soumissions()->create([
            'etudiant_id' => $request->user()->id,
            'fichier_soumis' => $filePath,
            'date_soumission' => now(),
        ]);

        return response()->json($soumission, 201);
    }
}
