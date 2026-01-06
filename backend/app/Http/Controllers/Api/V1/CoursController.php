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
        $this->authorizeResource(Cours::class, 'cour');
    }

    public function index()
    {
        return Cours::with('enseignant')->get();
    }

    public function store(StoreCoursRequest $request)
    {
        $cours = $request->user()->coursEnseignes()->create($request->validated());
        return response()->json($cours, 201);
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
