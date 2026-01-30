<?php

require_once 'backend/vendor/autoload.php';

try {
    // Initialize Laravel app
    $app = require_once 'backend/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    echo "=== Debug Base de Données ===\n";
    
    // 1. Vérifier la connexion
    echo "1. Connexion à la base de données:\n";
    try {
        $dbName = \DB::connection()->getDatabaseName();
        echo "   ✅ Connecté à: $dbName\n";
    } catch (Exception $e) {
        echo "   ❌ Erreur de connexion: " . $e->getMessage() . "\n";
        exit(1);
    }
    
    // 2. Vérifier si la table semestres existe
    echo "\n2. Vérification de la table semestres:\n";
    if (\Schema::hasTable('semestres')) {
        echo "   ✅ La table semestres existe\n";
        
        // Vérifier les colonnes
        $columns = \Schema::getColumnListing('semestres');
        echo "   Colonnes: " . implode(', ', $columns) . "\n";
        
        // Vérifier les colonnes requises
        $required = ['nom', 'description', 'date_debut', 'date_fin', 'is_active'];
        foreach ($required as $col) {
            if (in_array($col, $columns)) {
                echo "   ✅ Colonne '$col' présente\n";
            } else {
                echo "   ❌ Colonne '$col' manquante\n";
            }
        }
    } else {
        echo "   ❌ La table semestres n'existe pas!\n";
        echo "   Exécution de la migration...\n";
        
        try {
            \Artisan::call('migrate', ['--path' => 'database/migrations/2026_01_19_000005_create_semestres_departements_matieres_tables.php']);
            echo "   Migration: " . \Artisan::output() . "\n";
        } catch (Exception $e) {
            echo "   ❌ Erreur de migration: " . $e->getMessage() . "\n";
        }
    }
    
    // 3. Test du modèle Semestre
    echo "\n3. Test du modèle Semestre:\n";
    try {
        $semestre = new \App\Models\Semestre();
        echo "   ✅ Modèle Semestre chargeable\n";
        echo "   Fillable: " . implode(', ', $semestre->getFillable()) . "\n";
        
        // Test de création simple
        $test = \App\Models\Semestre::create([
            'nom' => 'Test Debug ' . date('H:i:s'),
            'description' => 'Test',
            'date_debut' => date('Y-m-d'),
            'date_fin' => date('Y-m-d', strtotime('+6 months')),
            'is_active' => true
        ]);
        echo "   ✅ Création réussie ID: {$test->id}\n";
        
        // Nettoyer
        $test->delete();
        echo "   ✅ Nettoyage effectué\n";
        
    } catch (Exception $e) {
        echo "   ❌ Erreur modèle: " . $e->getMessage() . "\n";
        echo "   Trace: " . $e->getTraceAsString() . "\n";
    }
    
} catch (Exception $e) {
    echo "ERREUR FATALE: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
