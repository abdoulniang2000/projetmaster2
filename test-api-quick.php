<?php

// Test rapide de l'API de création d'utilisateur
// À exécuter avec: php test-api-quick.php

require_once 'backend/vendor/autoload.php';

use Illuminate\Http\Request;
use App\Http\Controllers\UserController;
use App\Http\Requests\Api\V1\StoreUserRequest;

echo "🧪 Test de l'API de création d'utilisateur\n";
echo "=====================================\n\n";

// Test 1: Vérifier la connexion à la base
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=laravel', 'root', '');
    echo "✅ Connexion à la base de données: OK\n";
} catch (PDOException $e) {
    echo "❌ Connexion à la base de données: ERREUR - " . $e->getMessage() . "\n";
    exit(1);
}

// Test 2: Vérifier la structure de la table users
try {
    $stmt = $pdo->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $requiredColumns = ['first_name', 'last_name', 'email', 'password', 'department', 'student_id'];
    $missingColumns = array_diff($requiredColumns, $columns);
    
    if (empty($missingColumns)) {
        echo "✅ Structure de la table users: OK\n";
    } else {
        echo "❌ Colonnes manquantes dans users: " . implode(', ', $missingColumns) . "\n";
        echo "💡 Exécutez: php artisan migrate\n";
    }
} catch (PDOException $e) {
    echo "❌ Vérification de la table users: ERREUR - " . $e->getMessage() . "\n";
}

// Test 3: Vérifier les rôles
try {
    $stmt = $pdo->query("SELECT * FROM roles");
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($roles) > 0) {
        echo "✅ Rôles disponibles: " . implode(', ', array_column($roles, 'name')) . "\n";
    } else {
        echo "❌ Aucun rôle trouvé dans la base\n";
        echo "💡 Créez des rôles avec: php artisan tinker\n";
    }
} catch (PDOException $e) {
    echo "❌ Vérification des rôles: ERREUR - " . $e->getMessage() . "\n";
}

// Test 4: Tester la création via cURL
echo "\n🌐 Test de l'API via cURL:\n";
$ch = curl_init('http://127.0.0.1:8001/api/v1/users');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'first_name' => 'Test',
    'last_name' => 'API',
    'email' => 'test' . time() . '@example.com',
    'password' => 'password123',
    'role' => 'etudiant',
    'department' => 'Informatique',
    'student_id' => 'TEST' . time()
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 201) {
    echo "✅ Création d'utilisateur: OK (HTTP $httpCode)\n";
    echo "📄 Réponse: " . substr($response, 0, 200) . "...\n";
} else {
    echo "❌ Création d'utilisateur: ERREUR (HTTP $httpCode)\n";
    echo "📄 Réponse: $response\n";
}

echo "\n🎯 Test terminé!\n";
echo "================\n";
echo "Si tous les tests sont ✅, l'API est prête.\n";
echo "Sinon, suivez les instructions dans setup-users.md\n";
