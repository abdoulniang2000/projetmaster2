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
    public function index(Request $request)
    {
        // $this->authorize('viewAny', User::class);
        
        \Log::info('=== DÉBUT RÉCUPÉRATION UTILISATEURS ===', [
            'request_path' => $request->path(),
            'request_method' => $request->method(),
            'request_url' => $request->fullUrl(),
            'request_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_authenticated' => auth()->check(),
            'user_id' => auth()->id(),
            'timestamp' => now()->toDateTimeString()
        ]);
        
        try {
            $query = User::with('roles');
            \Log::info('Query créée avec succès', ['query_sql' => $query->toSql()]);
            
            // Filtrer les utilisateurs actifs
            $query->where('status', true);
            \Log::info('Filtre status appliqué');
            
            // Exclure l'utilisateur actuel des suggestions
            if (auth()->check()) {
                $query->where('id', '!=', auth()->id());
                \Log::info('Utilisateur actuel exclu des suggestions', ['user_id' => auth()->id()]);
            } else {
                \Log::warning('Aucun utilisateur authentifié trouvé - tous les utilisateurs seront inclus');
            }
            
            \Log::info('Exécution de la requête...');
            $usersCollection = $query->get();
            \Log::info('Utilisateurs récupérés depuis la base', [
                'count' => $usersCollection->count(),
                'memory_usage' => memory_get_usage(true),
                'execution_time' => microtime(true) - LARAVEL_START
            ]);
            
            // Vérifier si nous avons des utilisateurs
            if ($usersCollection->isEmpty()) {
                \Log::warning('Aucun utilisateur trouvé dans la base de données');
                return response()->json([]);
            }
            
            // Transformer les données pour correspondre au frontend
            \Log::info('Début transformation des données utilisateurs...');
            $users = $usersCollection->map(function ($user) {
                try {
                    $transformedUser = [
                        'id' => $user->id,
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                        'username' => $user->username,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'address' => $user->address,
                        'city' => $user->city,
                        'country' => $user->country,
                        'postal_code' => $user->postal_code,
                        'about' => $user->about,
                        'avatar' => $user->avatar,
                        'status' => $user->status,
                        'last_login_at' => $user->last_login_at,
                        'last_login_ip' => $user->last_login_ip,
                        'email_verified_at' => $user->email_verified_at,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                        'role' => $user->roles->first()?->name ?? 'etudiant', // Prend le premier rôle ou 'etudiant' par défaut
                        'is_online' => $user->last_login_at ? $user->last_login_at->gt(now()->subMinutes(5)) : false,
                    ];
                    
                    \Log::info('Utilisateur transformé', [
                        'user_id' => $user->id,
                        'first_name' => $transformedUser['first_name'],
                        'last_name' => $transformedUser['last_name'],
                        'role' => $transformedUser['role'],
                        'has_roles' => !empty($user->roles),
                        'roles_count' => $user->roles->count()
                    ]);
                    
                    return $transformedUser;
                } catch (\Exception $e) {
                    \Log::error('Erreur lors de la transformation d\'un utilisateur', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage(),
                        'file' => $e->getFile(),
                        'line' => $e->getLine()
                    ]);
                    return null;
                }
            })->filter(); // Supprimer les null
            
            \Log::info('Transformation des utilisateurs terminée', [
                'final_count' => $users->count(),
                'sample_user' => $users->first(),
                'memory_usage' => memory_get_usage(true)
            ]);
            
            \Log::info('=== RÉCUPÉRATION UTILISATEURS RÉUSSIE ===');
            return response()->json($users);
            
        } catch (\Illuminate\Database\QueryException $e) {
            \Log::error('ERREUR DE BASE DE DONNÉES lors de la récupération des utilisateurs', [
                'error' => $e->getMessage(),
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
                'code' => $e->getCode(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Erreur de base de données',
                'message' => config('app.debug') ? $e->getMessage() : 'Impossible de récupérer les utilisateurs'
            ], 500);
            
        } catch (\Exception $e) {
            \Log::error('ERREUR GÉNÉRALE lors de la récupération des utilisateurs', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'code' => $e->getCode(),
                'trace' => $e->getTraceAsString(),
                'memory_usage' => memory_get_usage(true),
                'timestamp' => now()->toDateTimeString()
            ]);
            
            return response()->json([
                'error' => 'Erreur lors de la récupération des utilisateurs',
                'message' => config('app.debug') ? $e->getMessage() : 'Erreur technique',
                'debug_info' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ] : null
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // $this->authorize('create', User::class);
        
        try {
            \Log::info('Tentative de création d\'utilisateur', ['data' => $request->all()]);
            
            $userData = $request->validated();
            $userData['password'] = Hash::make($request->password);
            $userData['status'] = true; // Activer par défaut
            $userData['role'] = $request->role ?? 'etudiant'; // Utiliser la colonne role existante
            
            // Créer l'utilisateur
            $user = User::create($userData);
            \Log::info('Utilisateur créé avec succès', ['user_id' => $user->id]);

            // Assigner le rôle dans la table user_roles
            $roleName = $request->role ?? 'etudiant';
            $role = \App\Models\Role::where('name', $roleName)->first();
            
            if ($role) {
                $user->roles()->attach($role->id);
                \Log::info('Rôle assigné', ['user_id' => $user->id, 'role' => $roleName]);
            } else {
                \Log::warning('Rôle non trouvé', ['role' => $roleName]);
            }

            return response()->json($user->load('roles'), 201);
            
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