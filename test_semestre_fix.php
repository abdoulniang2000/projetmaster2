<?php

require_once 'backend/vendor/autoload.php';

try {
    // Initialize Laravel app
    $app = require_once 'backend/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    echo "=== Test de correction des semestres ===\n";
    
    // 1. Vérifier la structure de la table
    echo "1. Vérification de la structure de la table semestres:\n";
    $columns = \Schema::getColumnListing('semestres');
    echo "   Colonnes: " . implode(', ', $columns) . "\n";
    
    // Vérifier que les champs nécessaires existent
    $requiredFields = ['nom', 'description', 'date_debut', 'date_fin', 'is_active'];
    foreach ($requiredFields as $field) {
        if (in_array($field, $columns)) {
            echo "   ✓ Champ '$field' existe\n";
        } else {
            echo "   ❌ Champ '$field' manquant\n";
        }
    }
    
    // Vérifier que annee_academique n'existe pas (c'était le problème)
    if (in_array('annee_academique', $columns)) {
        echo "   ⚠️  Champ 'annee_academique' existe (n'est pas utilisé par le contrôleur)\n";
    } else {
        echo "   ✓ Champ 'annee_academique' n'existe pas (normal)\n";
    }
    
    // 2. Vérifier les semestres existants
    echo "\n2. Vérification des semestres existants:\n";
    $count = \App\Models\Semestre::count();
    echo "   Nombre de semestres: $count\n";
    
    if ($count > 0) {
        $semestres = \App\Models\Semestre::take(3)->get();
        foreach ($semestres as $semestre) {
            echo "   - ID: {$semestre->id}, Nom: {$semestre->nom}, Actif: " . ($semestre->is_active ? 'Oui' : 'Non') . "\n";
        }
    }
    
    // 3. Créer un semestre de test
    echo "\n3. Création d'un semestre de test:\n";
    try {
        $testSemestre = \App\Models\Semestre::create([
            'nom' => 'Semestre Test ' . date('H:i:s'),
            'description' => 'Semestre de test pour validation',
            'date_debut' => now()->format('Y-m-d'),
            'date_fin' => now()->addMonths(6)->format('Y-m-d'),
            'is_active' => true
        ]);
        echo "   ✓ Semestre créé avec ID: {$testSemestre->id}\n";
        
        // 4. Vérifier la persistance
        echo "\n4. Vérification de la persistance:\n";
        $checkSemestre = \App\Models\Semestre::find($testSemestre->id);
        if ($checkSemestre) {
            echo "   ✓ Semestre trouvé dans la base de données\n";
            echo "   - Nom: {$checkSemestre->nom}\n";
            echo "   - Description: {$checkSemestre->description}\n";
            echo "   - Date début: {$checkSemestre->date_debut}\n";
            echo "   - Date fin: {$checkSemestre->date_fin}\n";
            echo "   - Actif: " . ($checkSemestre->is_active ? 'Oui' : 'Non') . "\n";
            echo "   - Created: {$checkSemestre->created_at}\n";
        } else {
            echo "   ❌ Semestre non trouvé après création!\n";
        }
        
        // 5. Nettoyer
        echo "\n5. Nettoyage:\n";
        $testSemestre->delete();
        echo "   ✓ Semestre de test supprimé\n";
        
    } catch (\Exception $e) {
        echo "   ❌ Erreur lors de la création: " . $e->getMessage() . "\n";
    }
    
    // 6. Vérifier les logs Laravel
    echo "\n6. Vérification des logs Laravel récents:\n";
    $logFile = 'backend/storage/logs/laravel.log';
    if (file_exists($logFile)) {
        $logs = file_get_contents($logFile);
        $recentLogs = substr($logs, -3000); // Derniers 3000 caractères
        // Filtrer les logs de semestre
        $semestreLogs = [];
        $lines = explode("\n", $recentLogs);
        foreach ($lines as $line) {
            if (strpos($line, 'SemestreController') !== false) {
                $semestreLogs[] = $line;
            }
        }
        
        if (!empty($semestreLogs)) {
            echo "   Logs récents de SemestreController:\n";
            foreach (array_slice($semestreLogs, -10) as $log) {
                echo "   " . $log . "\n";
            }
        } else {
            echo "   Aucun log récent trouvé pour SemestreController\n";
        }
    } else {
        echo "   Fichier de logs non trouvé\n";
    }
    
    echo "\n=== Test terminé ===\n";
    
} catch (\Exception $e) {
    echo "ERREUR FATALE: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
