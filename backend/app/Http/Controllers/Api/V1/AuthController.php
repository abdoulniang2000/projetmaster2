<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\LoginUserRequest;
use App\Http\Requests\Api\V1\RegisterUserRequest;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterUserRequest $request)
    {
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $defaultRole = Role::where('is_default', true)->first();
        if ($defaultRole) {
            $user->roles()->attach($defaultRole);
        }

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        \Log::info('=== LOGIN ATTEMPT START ===');
        \Log::info('Request data:', $request->all());
        \Log::info('Headers:', $request->headers->all());
        
        try {
            // Validation basique
            if (!$request->email || !$request->password) {
                \Log::warning('Missing credentials');
                return response()->json([
                    'message' => 'Missing credentials',
                    'error' => 'Email et mot de passe requis'
                ], 400);
            }

            // Vérifier si l'utilisateur existe
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                \Log::warning('User not found', ['email' => $request->email]);
                return response()->json([
                    'message' => 'Invalid login details',
                    'error' => 'Email ou mot de passe incorrect'
                ], 401);
            }

            // Vérifier le mot de passe
            if (!Hash::check($request->password, $user->password)) {
                \Log::warning('Invalid password', ['email' => $request->email]);
                return response()->json([
                    'message' => 'Invalid login details',
                    'error' => 'Email ou mot de passe incorrect'
                ], 401);
            }

            \Log::info('Auth successful for user:', ['id' => $user->id, 'email' => $user->email]);

            // Générer un token simple
            $token = Str::random(60);
            $user->remember_token = $token;
            $user->save();

            // Charger les rôles de l'utilisateur (avec gestion d'erreur)
            try {
                $user->load('roles');
            } catch (\Exception $e) {
                \Log::warning('Could not load roles: ' . $e->getMessage());
                // Continuer sans les rôles si erreur
            }

            \Log::info('Token generated, returning response...');
            
            return response()->json([
                'message' => 'Login successful',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            \Log::error('Login error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Server error',
                'error' => 'Erreur serveur lors de la connexion'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            if ($user) {
                $user->remember_token = null;
                $user->save();
            }
            return response()->json(['message' => 'Successfully logged out']);
        } catch (\Exception $e) {
            \Log::error('Logout error: ' . $e->getMessage());
            return response()->json(['message' => 'Logout failed'], 500);
        }
    }
}
