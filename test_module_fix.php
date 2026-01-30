<?php

require_once 'backend/vendor/autoload.php';

try {
    // Initialize Laravel app
    $app = require_once 'backend/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    echo "=== Test de correction des modules ===\n";
    
    // 1. Vérifier la structure de la table
    echo "1. Vérification de la structure de la table modules:\n";
    $columns = \Schema::getColumnListing('modules');
    echo "   Colonnes: " . implode(', ', $columns) . "\n";
    
    if (!in_array('nom', $columns)) {
        echo "   ⚠️  Le champ 'nom' n'existe pas. Exécution de la migration...\n";
        \Artisan::call('migrate', ['--path' => 'database/migrations/2026_01_27_200000_update_modules_table_structure.php']);
        echo "   Migration: " . \Artisan::output() . "\n";
    } else {
        echo "   ✓ Le champ 'nom' existe\n";
    }
    
    // 2. Vérifier les modules existants
    echo "\n2. Vérification des modules existants:\n";
    $count = \App\Models\Module::count();
    echo "   Nombre de modules: $count\n";
    
    if ($count > 0) {
        $modules = \App\Models\Module::take(3)->get();
        foreach ($modules as $module) {
            echo "   - ID: {$module->id}, Nom: " . ($module->nom ?? 'NULL') . ", Titre: " . ($module->titre ?? 'NULL') . "\n";
        }
    }
    
    // 3. Créer un module de test
    echo "\n3. Création d'un module de test:\n";
    try {
        $testModule = \App\Models\Module::create([
            'nom' => 'Module Test ' . date('H:i:s'),
            'titre' => 'Module Test ' . date('H:i:s'),
            'contenu' => 'Contenu de test',
            'ordre' => 999,
            'cours_id' => 1
        ]);
        echo "   ✓ Module créé avec ID: {$testModule->id}\n";
        
        // 4. Vérifier la persistance
        echo "\n4. Vérification de la persistance:\n";
        $checkModule = \App\Models\Module::find($testModule->id);
        if ($checkModule) {
            echo "   ✓ Module trouvé dans la base de données\n";
            echo "   - Nom: {$checkModule->nom}\n";
            echo "   - Titre: {$checkModule->titre}\n";
            echo "   - Created: {$checkModule->created_at}\n";
        } else {
            echo "   ✗ Module non trouvé après création!\n";
        }
        
        // 5. Nettoyer
        echo "\n5. Nettoyage:\n";
        $testModule->delete();
        echo "   ✓ Module de test supprimé\n";
        
    } catch (\Exception $e) {
        echo "   ✗ Erreur lors de la création: " . $e->getMessage() . "\n";
    }
    
    // 6. Vérifier les logs Laravel
    echo "\n6. Vérification des logs Laravel:\n";
    $logFile = 'backend/storage/logs/laravel.log';
    if (file_exists($logFile)) {
        $logs = file_get_contents($logFile);
        $recentLogs = substr($logs, -2000); // Derniers 2000 caractères
        echo "   Logs récents:\n";
        echo "   " . str_replace("\n", "\n   ", $recentLogs) . "\n";
    } else {
        echo "   Fichier de logs non trouvé\n";
    }
    
    echo "\n=== Test terminé ===\n";
    
} catch (\Exception $e) {
    echo "ERREUR FATALE: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
