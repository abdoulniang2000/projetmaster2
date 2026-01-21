<?php

echo "=== TEST DES ENDPOINTS API LARAVEL ===\n\n";

$baseURL = 'http://127.0.0.1:8000/api';
$endpoints = [
    '/v1/users' => 'GET',
    '/v1/register' => 'POST',
    '/v1/login' => 'POST',
    '/v1/roles' => 'GET'
];

foreach ($endpoints as $endpoint => $method) {
    echo "Test de $method $baseURL$endpoint...\n";
    
    $ch = curl_init($baseURL . $endpoint);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($endpoint === '/v1/register') {
            $data = [
                'first_name' => 'Test',
                'last_name' => 'API',
                'username' => 'test.api.' . time(),
                'email' => 'test.api.' . time() . '@example.com',
                'password' => 'password123'
            ];
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        }
    }
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        echo "   ✗ Erreur: $error\n";
    } else {
        echo "   ✓ Code HTTP: $httpCode\n";
        
        // Séparer headers et body
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $headers = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);
        
        echo "   Réponse: " . substr($body, 0, 200) . "...\n";
    }
    echo "\n";
}

echo "=== VÉRIFICATION DU SERVEUR LARAVEL ===\n";

// Test basique
$ch = curl_init('http://127.0.0.1:8000/');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "✗ Serveur inaccessible: $error\n";
    echo "Solution: Démarrez le serveur avec 'php artisan serve'\n";
} else {
    echo "✓ Serveur Laravel répond (Code: $httpCode)\n";
}

echo "\n=== DIAGNOSTIC DES ROUTES ===\n";

// Vérifier si les routes API existent
$apiRoutes = [
    '/api/v1/users',
    '/api/v1/register', 
    '/api/v1/login'
];

foreach ($apiRoutes as $route) {
    echo "Vérification de la route $route...\n";
    $ch = curl_init('http://127.0.0.1:8000' . $route);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    
    curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        echo "   ✗ Erreur: $error\n";
    } else {
        echo "   ✓ Code: $httpCode\n";
    }
}
