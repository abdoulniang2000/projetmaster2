<?php

require_once 'backend/vendor/autoload.php';

try {
    // Initialize Laravel app
    $app = require_once 'backend/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    echo "=== Test Modules Debug ===\n";
    
    // Check database connection
    echo "1. Database connection: ";
    try {
        $db = \DB::connection()->getDatabaseName();
        echo "OK (Database: $db)\n";
    } catch (Exception $e) {
        echo "FAILED: " . $e->getMessage() . "\n";
        exit;
    }
    
    // Check modules table
    echo "2. Modules table exists: ";
    try {
        $exists = \Schema::hasTable('modules');
        echo $exists ? "YES\n" : "NO\n";
        
        if (!$exists) {
            echo "   Running migration...\n";
            \Artisan::call('migrate', ['--path' => 'database/migrations/2025_12_19_101700_create_modules_table.php']);
            echo "   Migration result: " . \Artisan::output() . "\n";
        }
    } catch (Exception $e) {
        echo "ERROR: " . $e->getMessage() . "\n";
    }
    
    // Check modules count
    echo "3. Modules count: ";
    try {
        $count = \App\Models\Module::count();
        echo "$count\n";
        
        if ($count > 0) {
            echo "   Sample modules:\n";
            $modules = \App\Models\Module::take(5)->get();
            foreach ($modules as $module) {
                echo "   - ID: {$module->id}, Titre: {$module->titre}, Cours ID: {$module->cours_id}\n";
            }
        }
    } catch (Exception $e) {
        echo "ERROR: " . $e->getMessage() . "\n";
    }
    
    // Test creating a module
    echo "4. Test module creation: ";
    try {
        $testModule = \App\Models\Module::create([
            'titre' => 'Test Module ' . date('Y-m-d H:i:s'),
            'contenu' => 'Test content',
            'ordre' => 1,
            'cours_id' => 1
        ]);
        echo "SUCCESS (ID: {$testModule->id})\n";
        
        // Verify it was saved
        $verifyCount = \App\Models\Module::count();
        echo "   New count: $verifyCount\n";
        
        // Clean up
        $testModule->delete();
        $finalCount = \App\Models\Module::count();
        echo "   After cleanup: $finalCount\n";
        
    } catch (Exception $e) {
        echo "FAILED: " . $e->getMessage() . "\n";
    }
    
    // Check API routes
    echo "5. API routes check: ";
    try {
        $routes = \Route::getRoutes();
        $moduleRoutes = [];
        foreach ($routes as $route) {
            if (strpos($route->uri(), 'modules') !== false) {
                $moduleRoutes[] = $route->methods()[0] . ' ' . $route->uri();
            }
        }
        echo count($moduleRoutes) . " routes found\n";
        foreach ($moduleRoutes as $route) {
            echo "   - $route\n";
        }
    } catch (Exception $e) {
        echo "ERROR: " . $e->getMessage() . "\n";
    }
    
} catch (Exception $e) {
    echo "FATAL ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
