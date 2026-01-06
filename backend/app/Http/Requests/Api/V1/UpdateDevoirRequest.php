<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDevoirRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Géré par la Policy
    }

    public function rules(): array
    {
        return [
            'cours_id' => 'sometimes|required|exists:cours,id',
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'date_limite' => 'sometimes|required|date',
            'fichier_joint' => 'nullable|file|max:10240', // 10MB Max
        ];
    }
}
