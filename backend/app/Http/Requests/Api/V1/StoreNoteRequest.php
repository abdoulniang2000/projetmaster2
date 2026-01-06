<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Géré par la Policy
    }

    public function rules(): array
    {
        return [
            'note' => 'required|numeric|min:0|max:20',
            'commentaire' => 'nullable|string',
        ];
    }
}
