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

    // Protected routes (temporarily removed middleware)
    // Route::middleware('auth.basic')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // User CRUD
        Route::apiResource('users', \App\Http\Controllers\UserController::class);
        
        // Roles
        Route::get('roles', function () {
            return \App\Models\Role::all();
        });
    // });
});
