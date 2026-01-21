<?php

echo "=== TEST DE CRÉATION D'UTILISATEUR VIA API LARAVEL ===\n\n";

// Test via l'API d'inscription
$apiUrl = 'http://localhost:8000/api/v1/register'; // Adapter si nécessaire

$userData = [
    'first_name' => 'API',
    'last_name' => 'Test',
    'username' => 'api.test.' . time(),
    'email' => 'api.test.' . time() . '@example.com',
    'password' => 'password123'
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

echo "1. Envoi de la requête à l'API...\n";
echo "   URL: $apiUrl\n";
echo "   Données: " . json_encode($userData, JSON_PRETTY_PRINT) . "\n\n";

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "2. Réponse de l'API:\n";
echo "   Code HTTP: $httpCode\n";
echo "   Réponse: $response\n\n";

if ($httpCode === 201) {
    echo "✓ Utilisateur créé avec succès via l'API!\n";
    $responseData = json_decode($response, true);
    echo "   Email: {$userData['email']}\n";
    echo "   Mot de passe: password123\n";
} else {
    echo "✗ Erreur lors de la création via l'API\n";
    echo "   Vérifiez que votre serveur Laravel est démarré (php artisan serve)\n";
}

echo "\n=== TEST DE CONNEXION ===\n\n";

// Test de connexion
$loginData = [
    'email' => $userData['email'],
    'password' => 'password123'
];

$ch = curl_init('http://localhost:8000/api/v1/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$loginResponse = curl_exec($ch);
$loginHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "3. Test de connexion:\n";
echo "   Code HTTP: $loginHttpCode\n";
echo "   Réponse: $loginResponse\n";

if ($loginHttpCode === 200) {
    echo "✓ Connexion réussie!\n";
} else {
    echo "✗ Erreur de connexion\n";
}
