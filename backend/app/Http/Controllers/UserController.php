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
        
        $userData = $request->validated();
        $userData['password'] = Hash::make($request->password);
        
        $user = User::create($userData);

        // Assigner le rôle spécifié
        $role = \App\Models\Role::where('name', $request->role)->first();
        if ($role) {
            $user->roles()->attach($role);
        }

        return response()->json($user->load('roles'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);
        return $user->load('roles');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('update', $user);
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
        $this->authorize('delete', $user);
        $user->delete();
        return response()->json(null, 204);
    }
}