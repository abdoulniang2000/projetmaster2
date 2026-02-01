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
    
    // Roles
    Route::get('roles', function () {
        return \App\Models\Role::all();
    });

    // Modules, Matieres, Semestres, Cours, Departements
    Route::apiResource('modules', \App\Http\Controllers\Api\V1\ModuleController::class);
    Route::apiResource('matieres', \App\Http\Controllers\Api\V1\MatiereController::class);
    Route::apiResource('semestres', \App\Http\Controllers\Api\V1\SemestreController::class);
    Route::apiResource('cours', \App\Http\Controllers\Api\V1\CoursController::class);
    Route::apiResource('departements', \App\Http\Controllers\Api\V1\DepartementController::class);
    
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
});

// Protected routes (temporarily removed middleware)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
