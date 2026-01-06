<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCoursRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Géré par la Policy
    }

    public function rules(): array
    {
        return [
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
        ];
    }
}
