<?php

require_once 'backend/vendor/autoload.php';

use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\SemestreController;
use App\Http\Controllers\Api\V1\MatiereController;
use App\Http\Controllers\Api\V1\ModuleController;

// Bootstrap Laravel
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Test de création de semestre ===\n";

// Test 1: Création d'un semestre
echo "1. Test création semestre...\n";
$request = new Request([
    'nom' => 'Semestre 1 Test',
    'description' => 'Semestre de test pour debugging'
]);

$semestreController = new SemestreController();
try {
    $response = $semestreController->store($request);
    echo "✅ Semestre créé: " . json_encode($response->getData()) . "\n";
} catch (Exception $e) {
    echo "❌ Erreur création semestre: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}

echo "\n=== Test de création de matière ===\n";

// Test 2: Création d'une matière
echo "2. Test création matière...\n";
$request = new Request([
    'nom' => 'Mathématiques Test',
    'code' => 'MAT001',
    'description' => 'Matière de test pour debugging',
    'departement' => 'Informatique'
]);

$matiereController = new MatiereController();
try {
    $response = $matiereController->store($request);
    echo "✅ Matière créée: " . json_encode($response->getData()) . "\n";
} catch (Exception $e) {
    echo "❌ Erreur création matière: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}

echo "\n=== Test de création de module ===\n";

// Test 3: Création d'un module
echo "3. Test création module...\n";
$request = new Request([
    'nom' => 'Module Test',
    'cours_id' => 1,
    'contenu' => 'Contenu du module de test',
    'ordre' => 1
]);

$moduleController = new ModuleController();
try {
    $response = $moduleController->store($request);
    echo "✅ Module créé: " . json_encode($response->getData()) . "\n";
} catch (Exception $e) {
    echo "❌ Erreur création module: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}

echo "\n=== Test de récupération des données ===\n";

// Test 4: Récupération des semestres
echo "4. Test récupération semestres...\n";
try {
    $semestres = $semestreController->index();
    echo "✅ Semestres récupérés: " . json_encode($semestres) . "\n";
} catch (Exception $e) {
    echo "❌ Erreur récupération semestres: " . $e->getMessage() . "\n";
}

// Test 5: Récupération des matières
echo "5. Test récupération matières...\n";
try {
    $matieres = $matiereController->index();
    echo "✅ Matières récupérées: " . json_encode($matieres) . "\n";
} catch (Exception $e) {
    echo "❌ Erreur récupération matières: " . $e->getMessage() . "\n";
}

// Test 6: Récupération des modules
echo "6. Test récupération modules...\n";
try {
    $modules = $moduleController->index();
    echo "✅ Modules récupérés: " . json_encode($modules) . "\n";
} catch (Exception $e) {
    echo "❌ Erreur récupération modules: " . $e->getMessage() . "\n";
}

echo "\n=== Vérification de la base de données ===\n";

// Test 7: Vérification directe en base de données
try {
    $semestres = \App\Models\Semestre::all();
    echo "✅ Semestres en base: " . $semestres->count() . " enregistrements\n";
    
    $matieres = \App\Models\Matiere::all();
    echo "✅ Matières en base: " . $matieres->count() . " enregistrements\n";
    
    $modules = \App\Models\Module::all();
    echo "✅ Modules en base: " . $modules->count() . " enregistrements\n";
    
} catch (Exception $e) {
    echo "❌ Erreur accès base: " . $e->getMessage() . "\n";
}

echo "\n=== Test terminé ===\n";
