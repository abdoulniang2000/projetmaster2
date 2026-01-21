<?php

namespace App\Http\Controllers;

use App\Http\Requests\Api\V1\StoreUserRequest;
use App\Http\Requests\Api\V1\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $this->authorize('viewAny', User::class);
        return User::with('roles')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // $this->authorize('create', User::class);
        
        try {
            \Log::info('Tentative de création d\'utilisateur', ['data' => $request->validated()]);
            
            $userData = $request->validated();
            $userData['password'] = Hash::make($request->password);
            $userData['status'] = true; // Activer par défaut
            $userData['role'] = $request->role; // Utiliser la colonne role existante
            
            $user = User::create($userData);
            \Log::info('Utilisateur créé avec succès', ['user_id' => $user->id]);

            return response()->json($user, 201);
            
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création de l\'utilisateur', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors de la création de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // $this->authorize('view', $user);
        return $user->load('roles');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        // $this->authorize('update', $user);
        $user->update($request->validated());

        if ($request->has('password') && $request->password) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        return response()->json($user->load('roles'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // $this->authorize('delete', $user);
        $user->delete();
        return response()->json(null, 204);
    }
}