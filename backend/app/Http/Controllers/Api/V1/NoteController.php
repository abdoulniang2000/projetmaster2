<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreNoteRequest;
use App\Models\Note;
use App\Models\Soumission;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function store(StoreNoteRequest $request, Soumission $soumission)
    {
        $this->authorize('create', [Note::class, $soumission]);

        $note = $soumission->note()->create([
            'evaluateur_id' => $request->user()->id,
            'note' => $request->note,
            'commentaire' => $request->commentaire,
        ]);

        return response()->json($note, 201);
    }

    public function update(StoreNoteRequest $request, Note $note)
    {
        $this->authorize('update', $note);

        $note->update($request->validated());

        return response()->json($note);
    }
}
