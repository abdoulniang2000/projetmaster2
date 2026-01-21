<?php

// Vérifier si le serveur Laravel fonctionne
echo "=== VÉRIFICATION SERVEUR LARAVEL ===\n\n";

// Test 1: Vérifier si le serveur répond
$testUrl = 'http://127.0.0.1:8001/api/v1/test';
echo "Test 1: Vérification du serveur sur $testUrl\n";

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $testUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 5
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "❌ Erreur de connexion: $error\n";
    echo "Le serveur Laravel n'est probablement pas démarré.\n";
    echo "\nPour démarrer le serveur:\n";
    echo "cd backend\n";
    echo "php artisan serve --host=127.0.0.1 --port=8001\n";
} else {
    echo "✅ Serveur répond (HTTP $httpCode)\n";
    echo "Réponse: $response\n";
}

echo "\n" . str_repeat("=", 50) . "\n\n";

// Test 2: Vérifier la base de données
echo "Test 2: Vérification de la base de données\n";

try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=mastercampus;charset=utf8mb4", 'root', '');
    echo "✅ Connexion à la base de données réussie\n";
    
    // Vérifier les rôles
    $stmt = $pdo->query("SELECT id, name, display_name FROM roles");
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Rôles disponibles:\n";
    foreach ($roles as $role) {
        echo "- {$role['id']}: {$role['name']} ({$role['display_name']})\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Erreur de base de données: " . $e->getMessage() . "\n";
}

echo "\n=== DIAGNOSTIC TERMINÉ ===\n";
?>
