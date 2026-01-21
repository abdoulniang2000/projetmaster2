<?php

// Test direct de l'API de création d'utilisateur
echo "=== TEST API CRÉATION UTILISATEUR ===\n\n";

$url = 'http://127.0.0.1:8001/api/v1/users';
$data = [
    'first_name' => 'Test',
    'last_name' => 'API',
    'email' => 'test.api.' . time() . '@example.com',
    'password' => 'password123',
    'role' => 'etudiant',
    'phone' => '771234567'
];

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json'
    ],
    CURLOPT_TIMEOUT => 30
]);

echo "URL: $url\n";
echo "Méthode: POST\n";
echo "Données: " . json_encode($data, JSON_PRETTY_PRINT) . "\n\n";

echo "Envoi de la requête...\n";

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

if ($error) {
    echo "❌ Erreur cURL: $error\n";
} else {
    echo "✅ Réponse reçue (HTTP $httpCode)\n";
    echo "Réponse brute: $response\n\n";
    
    $responseData = json_decode($response, true);
    if ($responseData) {
        echo "Réponse JSON:\n";
        echo json_encode($responseData, JSON_PRETTY_PRINT) . "\n";
    }
}

echo "\n=== FIN DU TEST ===\n";
?>
