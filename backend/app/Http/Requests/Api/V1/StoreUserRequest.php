<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Sera géré par la Policy
    }

    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:admin,enseignant,etudiant,ETUDIANT',
            'phone' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:255',
            'student_id' => 'nullable|string|max:50',
        ];
    }
}
