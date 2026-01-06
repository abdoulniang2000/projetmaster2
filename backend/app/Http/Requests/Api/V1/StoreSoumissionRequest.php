<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreSoumissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Géré par la Policy
    }

    public function rules(): array
    {
        return [
            'fichier_soumis' => 'required|file|max:10240', // 10MB Max
        ];
    }
}
