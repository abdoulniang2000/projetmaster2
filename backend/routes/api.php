<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API Version 1
Route::prefix('v1')->group(function () {
    // Test endpoint
    Route::get('/test', function () {
        return response()->json([
            'message' => 'API working',
            'timestamp' => now(),
            'database' => \DB::connection()->getDatabaseName()
        ]);
    });
    
    // Auth routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Simple login test
    Route::post('/login-simple', function (Request $request) {
        \Log::info('Simple login test', $request->all());
        
        try {
            $email = $request->input('email');
            $password = $request->input('password');
            
            if (!$email || !$password) {
                return response()->json(['error' => 'Missing credentials'], 400);
            }
            
            return response()->json([
                'message' => 'Simple login works',
                'email' => $email,
                'password_length' => strlen($password)
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    // Minimal login endpoint
    Route::post('/login-minimal', function () {
        return response()->json([
            'message' => 'Minimal login works',
            'timestamp' => now()->toDateTimeString()
        ]);
    });

    // Analytics
    Route::get('/analytics/dashboard', [\App\Http\Controllers\Api\V1\AnalyticsController::class, 'dashboard']);

    // User CRUD (temporairement non protégé pour le debug)
    Route::apiResource('users', \App\Http\Controllers\UserController::class);
    
    // Route de test pour l'API users
    Route::get('/test-users', function (Request $request) {
        \Log::info('=== DÉBUT ROUTE TEST USERS ===', [
            'request_path' => $request->path(),
            'request_method' => $request->method(),
            'request_ip' => $request->ip(),
            'timestamp' => now()->toDateTimeString()
        ]);
        
        try {
            \Log::info('Tentative de connexion à la base de données...');
            
            // Test simple de connexion
            $connectionTest = \DB::connection()->getPdo();
            \Log::info('Connexion DB réussie', ['database' => \DB::connection()->getDatabaseName()]);
            
            // Test de requête simple
            $userCount = \App\Models\User::count();
            \Log::info('Test count users', ['count' => $userCount]);
            
            $activeUserCount = \App\Models\User::where('status', true)->count();
            \Log::info('Test count active users', ['count' => $activeUserCount]);
            
            \Log::info('Exécution de la requête principale...');
            $users = \App\Models\User::with('roles')
                ->where('status', true)
                ->limit(5)
                ->get();
            
            \Log::info('Utilisateurs récupérés dans route test', [
                'count' => $users->count(),
                'memory_usage' => memory_get_usage(true)
            ]);
            
            $transformedUsers = $users->map(function ($user) {
                try {
                    return [
                        'id' => $user->id,
                        'name' => trim($user->first_name . ' ' . $user->last_name), // Utiliser first_name + last_name
                        'email' => $user->email,
                        'roles' => $user->roles->pluck('name'),
                        'status' => $user->status,
                        'last_login_at' => $user->last_login_at,
                        'raw_first_name' => $user->first_name,
                        'raw_last_name' => $user->last_name
                    ];
                } catch (\Exception $e) {
                    \Log::error('Erreur transformation utilisateur dans route test', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage()
                    ]);
                    return null;
                }
            })->filter();
            
            \Log::info('=== ROUTE TEST USERS RÉUSSIE ===', [
                'final_count' => $transformedUsers->count(),
                'sample_user' => $transformedUsers->first()
            ]);
            
            return response()->json([
                'success' => true,
                'count' => $transformedUsers->count(),
                'users' => $transformedUsers,
                'debug_info' => [
                    'db_connection' => 'OK',
                    'total_users' => $userCount,
                    'active_users' => $activeUserCount,
                    'memory_usage' => memory_get_usage(true),
                    'timestamp' => now()->toDateTimeString()
                ]
            ]);
            
        } catch (\Illuminate\Database\QueryException $e) {
            \Log::error('ERREUR DB ROUTE TEST USERS', [
                'error' => $e->getMessage(),
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
                'code' => $e->getCode(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Erreur de base de données',
                'message' => $e->getMessage(),
                'debug_info' => config('app.debug') ? [
                    'sql' => $e->getSql(),
                    'bindings' => $e->getBindings()
                ] : null
            ], 500);
            
        } catch (\Exception $e) {
            \Log::error('ERREUR GÉNÉRALE ROUTE TEST USERS', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'debug_info' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ] : null
            ], 500);
        }
    });
    
    // Roles
    Route::get('roles', function () {
        return \App\Models\Role::all();
    });

    // Modules, Matieres, Semestres, Cours, Departements (completely without middleware for debug)
    Route::apiResource('modules', \App\Http\Controllers\Api\V1\ModuleController::class);
    Route::apiResource('matieres', \App\Http\Controllers\Api\V1\MatiereController::class);
    Route::apiResource('semestres', \App\Http\Controllers\Api\V1\SemestreController::class);
    Route::apiResource('cours', \App\Http\Controllers\Api\V1\CoursController::class);
    Route::apiResource('departements', \App\Http\Controllers\Api\V1\DepartementController::class);
    
    // Route spécifique pour les cours de l'enseignant (sans auth)
    Route::get('cours/enseignant', [\App\Http\Controllers\Api\V1\CoursController::class, 'enseignantCours']);
    
    // Devoirs et Soumissions
    Route::apiResource('devoirs', \App\Http\Controllers\Api\V1\DevoirController::class);
    Route::post('devoirs/{devoir}/soumissions', [\App\Http\Controllers\Api\V1\SoumissionController::class, 'store']);
    Route::get('devoirs/{devoir}/soumissions', [\App\Http\Controllers\Api\V1\SoumissionController::class, 'index']);
    
    // Notes
    Route::post('soumissions/{soumission}/notes', [\App\Http\Controllers\Api\V1\NoteController::class, 'store']);
    Route::put('notes/{note}', [\App\Http\Controllers\Api\V1\NoteController::class, 'update']);
    
    // Fichiers (supports de cours, etc.)
    Route::apiResource('fichiers', \App\Http\Controllers\Api\V1\FichierController::class);
    Route::get('fichiers/{fichier}/download', [\App\Http\Controllers\Api\V1\FichierController::class, 'download']);
    
    // Annonces
    Route::apiResource('annonces', \App\Http\Controllers\Api\V1\AnnonceController::class);
    
    // Forums et Discussions
    Route::apiResource('forums', \App\Http\Controllers\Api\V1\ForumController::class);
    Route::post('forums/{forum}/messages', [\App\Http\Controllers\Api\V1\ForumController::class, 'addMessage']);
    
    // Notifications
    Route::get('notifications', [\App\Http\Controllers\Api\V1\NotificationController::class, 'index']);
    Route::put('notifications/{notification}/read', [\App\Http\Controllers\Api\V1\NotificationController::class, 'markAsRead']);
    
    // Espace étudiant
    Route::get('student/cours', [\App\Http\Controllers\Api\V1\StudentController::class, 'cours']);
    Route::get('student/devoirs', [\App\Http\Controllers\Api\V1\StudentController::class, 'devoirs']);
    Route::get('student/notes', [\App\Http\Controllers\Api\V1\StudentController::class, 'notes']);
    
    // Espace enseignant
    Route::get('teacher/cours', [\App\Http\Controllers\Api\V1\TeacherController::class, 'cours']);
    Route::get('teacher/students', [\App\Http\Controllers\Api\V1\TeacherController::class, 'students']);
    Route::post('teacher/validate-student/{student}', [\App\Http\Controllers\Api\V1\TeacherController::class, 'validateStudent']);
    
    // Messagerie
    Route::apiResource('conversations', \App\Http\Controllers\Api\V1\ConversationController::class);
    Route::get('conversations/by-matiere/{matiereId}', [\App\Http\Controllers\Api\V1\ConversationController::class, 'getConversationsByMatiere']);
    Route::get('conversations/{conversation}/messages', [\App\Http\Controllers\Api\V1\ConversationController::class, 'messages']);
    Route::post('conversations/{conversation}/messages', [\App\Http\Controllers\Api\V1\ConversationController::class, 'sendMessage']);
    Route::put('conversations/{conversation}/mark-read', [\App\Http\Controllers\Api\V1\ConversationController::class, 'markAsRead']);
    Route::post('conversations/{conversation}/participants', [\App\Http\Controllers\Api\V1\ConversationController::class, 'addParticipant']);
    Route::delete('conversations/{conversation}/participants', [\App\Http\Controllers\Api\V1\ConversationController::class, 'removeParticipant']);
    Route::get('messages/tags', [\App\Http\Controllers\Api\V1\ConversationController::class, 'getTagsPredefinis']);
    Route::get('messages/by-tag/{tag}', [\App\Http\Controllers\Api\V1\ConversationController::class, 'searchByTag']);
});

// Protected routes (temporarily removed middleware)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
