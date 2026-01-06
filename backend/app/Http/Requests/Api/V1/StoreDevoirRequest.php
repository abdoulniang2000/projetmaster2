<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreDevoirRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Géré par la Policy
    }

    public function rules(): array
    {
        return [
            'cours_id' => 'required|exists:cours,id',
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'date_limite' => 'required|date',
            'fichier_joint' => 'nullable|file|max:10240', // 10MB Max
        ];
    }
}
