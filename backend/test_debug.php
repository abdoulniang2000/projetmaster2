<?php

// Test simple pour vérifier la connexion et la création
echo "Test de création de semestre et matière...\n";

// Inclure l'autoloader
require __DIR__ . '/vendor/autoload.php';

// Démarrer l'application Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    // Test création semestre
    echo "1. Création d'un semestre...\n";
    $semestre = new \App\Models\Semestre();
    $semestre->nom = 'Semestre 1 Test';
    $semestre->description = 'Semestre de test';
    $semestre->date_debut = '2024-01-01';
    $semestre->date_fin = '2024-06-30';
    $semestre->is_active = true;
    $semestre->save();
    
    echo "✅ Semestre créé avec ID: " . $semestre->id . "\n";
    
    // Test création matière
    echo "2. Création d'une matière...\n";
    
    // D'abord créer un département si nécessaire
    $departement = \App\Models\Departement::first();
    if (!$departement) {
        $departement = new \App\Models\Departement();
        $departement->nom = 'Informatique';
        $departement->code = 'INFO';
        $departement->description = 'Département informatique';
        $departement->save();
        echo "✅ Département créé avec ID: " . $departement->id . "\n";
    }
    
    $matiere = new \App\Models\Matiere();
    $matiere->nom = 'Mathématiques Test';
    $matiere->code = 'MAT001';
    $matiere->description = 'Matière de test';
    $matiere->departement_id = $departement->id;
    $matiere->credits = 3;
    $matiere->save();
    
    echo "✅ Matière créée avec ID: " . $matiere->id . "\n";
    
    // Test création module
    echo "3. Création d'un module...\n";
    
    // D'abord créer un cours si nécessaire
    $cours = \App\Models\Cours::first();
    if (!$cours) {
        $cours = new \App\Models\Cours();
        $cours->titre = 'Cours de test';
        $cours->description = 'Cours de test pour module';
        $cours->semestre_id = $semestre->id;
        $cours->matiere_id = $matiere->id;
        $cours->save();
        echo "✅ Cours créé avec ID: " . $cours->id . "\n";
    }
    
    $module = new \App\Models\Module();
    $module->nom = 'Module Test';
    $module->cours_id = $cours->id;
    $module->titre = 'Module de test';
    $module->contenu = 'Contenu du module de test';
    $module->ordre = 1;
    $module->save();
    
    echo "✅ Module créé avec ID: " . $module->id . "\n";
    
    // Vérification
    echo "\n=== Vérification ===\n";
    echo "Semestres: " . \App\Models\Semestre::count() . "\n";
    echo "Matières: " . \App\Models\Matiere::count() . "\n";
    echo "Modules: " . \App\Models\Module::count() . "\n";
    echo "Départements: " . \App\Models\Departement::count() . "\n";
    echo "Cours: " . \App\Models\Cours::count() . "\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "Fichier: " . $e->getFile() . " Ligne: " . $e->getLine() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\nTest terminé.\n";
