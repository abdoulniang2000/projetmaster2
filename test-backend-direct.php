<?php

// Test direct du backend pour identifier l'erreur 500
// À exécuter avec: php test-backend-direct.php

require_once 'backend/vendor/autoload.php';

use Illuminate\Http\Request;
use App\Http\Controllers\UserController;

echo "🧪 TEST DIRECT DU BACKEND\n";
echo "========================\n\n";

try {
    // Test 1: Vérifier la connexion à la base
    echo "1️⃣ Test connexion base de données...\n";
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=laravel', 'root', '');
    echo "✅ Connexion base: OK\n\n";
    
    // Test 2: Vérifier la structure de la table users
    echo "2️⃣ Vérification structure table users...\n";
    $stmt = $pdo->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "✅ Colonnes trouvées: " . implode(', ', $columns) . "\n\n";
    
    // Test 3: Vérifier les rôles
    echo "3️⃣ Vérification rôles disponibles...\n";
    $stmt = $pdo->query("SELECT * FROM roles");
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($roles) > 0) {
        echo "✅ Rôles trouvés:\n";
        foreach ($roles as $role) {
            echo "   - {$role['name']}: {$role['description']}\n";
        }
    } else {
        echo "❌ Aucun rôle trouvé!\n";
    }
    echo "\n";
    
    // Test 4: Simulation de création d'utilisateur
    echo "4️⃣ Test création utilisateur (simulation)...\n";
    
    $testData = [
        'first_name' => 'Test',
        'last_name' => 'Direct',
        'email' => 'test' . time() . '@direct.com',
        'password' => 'password123',
        'role' => 'etudiant',
        'department' => 'Test',
        'student_id' => 'TEST' . time()
    ];
    
    echo "Données de test: " . json_encode($testData, JSON_PRETTY_PRINT) . "\n";
    
    // Vérifier si les colonnes existent
    $requiredColumns = ['first_name', 'last_name', 'email', 'password', 'department', 'student_id'];
    $missingColumns = array_diff($requiredColumns, $columns);
    
    if (!empty($missingColumns)) {
        echo "❌ Colonnes manquantes: " . implode(', ', $missingColumns) . "\n";
        echo "💡 Exécutez: php artisan migrate\n";
    } else {
        echo "✅ Toutes les colonnes requises existent\n";
    }
    
    // Test 5: Vérifier les permissions
    echo "\n5️⃣ Vérification permissions...\n";
    if (is_dir('backend/storage')) {
        echo "✅ Dossier storage accessible\n";
    } else {
        echo "❌ Dossier storage inaccessible\n";
    }
    
    if (is_writable('backend/storage/logs')) {
        echo "✅ Dossier logs accessible en écriture\n";
    } else {
        echo "❌ Dossier logs non accessible en écriture\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Erreur base de données: " . $e->getMessage() . "\n";
    echo "💡 Vérifiez que MySQL/MariaDB est démarré\n";
} catch (Exception $e) {
    echo "❌ Erreur générale: " . $e->getMessage() . "\n";
    echo "💡 Vérifiez la configuration Laravel\n";
}

echo "\n🎯 Test terminé!\n";
echo "================\n";

// Instructions pour corriger les problèmes courants
echo "\n📋 SOLUTIONS RAPIDES:\n";
echo "==================\n";
echo "1. Si colonnes manquantes: php artisan migrate\n";
echo "2. Si base inaccessible: démarrer MySQL/MariaDB\n";
echo "3. Si rôles manquants: php artisan tinker\n";
echo "   >>> \\App\\Models\\Role::create(['name' => 'etudiant']);\n";
echo "4. Si permissions: chmod -R 755 backend/storage\n";
