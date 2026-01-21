<?php

echo "=== TEST DE L'API USERS ===\n\n";

$baseURL = 'http://127.0.0.1:8000/api/v1';

// Test 1: GET users (liste)
echo "1. Test GET /users...\n";
$ch = curl_init($baseURL . '/users');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "   ✗ Erreur: $error\n";
} else {
    echo "   ✓ Code HTTP: $httpCode\n";
    echo "   Réponse: " . substr($response, 0, 300) . "...\n";
}
echo "\n";

// Test 2: POST users (création)
echo "2. Test POST /users (création)...\n";

$userData = [
    'first_name' => 'Test',
    'last_name' => 'API',
    'email' => 'test.api.' . time() . '@example.com',
    'password' => 'password123',
    'role' => 'etudiant',
    'phone' => '771234567',
    'department' => 'Informatique'
];

$ch = curl_init($baseURL . '/users');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "   ✗ Erreur: $error\n";
} else {
    echo "   ✓ Code HTTP: $httpCode\n";
    echo "   Données envoyées: " . json_encode($userData, JSON_PRETTY_PRINT) . "\n";
    echo "   Réponse: " . substr($response, 0, 500) . "...\n";
}
echo "\n";

// Test 3: GET roles (pour vérifier les rôles disponibles)
echo "3. Test GET /roles...\n";
$ch = curl_init($baseURL . '/roles');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "   ✗ Erreur: $error\n";
} else {
    echo "   ✓ Code HTTP: $httpCode\n";
    $roles = json_decode($response, true);
    if (is_array($roles)) {
        echo "   Rôles disponibles:\n";
        foreach ($roles as $role) {
            echo "     - {$role['name']} ({$role['display_name']})\n";
        }
    } else {
        echo "   Réponse: " . substr($response, 0, 200) . "...\n";
    }
}

echo "\n=== FIN DES TESTS ===\n";
