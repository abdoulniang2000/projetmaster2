<?php

echo "=== TEST DE CRÉATION DE MODULE ===\n\n";

$baseURL = 'http://127.0.0.1:8001/api/v1';

// Test 1: Vérifier s'il y a des cours
echo "1. Vérification des cours disponibles...\n";
$ch = curl_init($baseURL . '/cours');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "   ✗ Erreur: $error\n";
} else {
    echo "   ✓ Code HTTP: $httpCode\n";
    $cours = json_decode($response, true);
    if (is_array($cours) && count($cours) > 0) {
        echo "   ✓ " . count($cours) . " cours trouvés\n";
        echo "   Premier cours: " . $cours[0]['nom'] . " (ID: " . $cours[0]['id'] . ")\n";
    } else {
        echo "   ⚠ Aucun cours trouvé - utilisation de l'ID par défaut\n";
    }
}

echo "\n";

// Test 2: Création de module avec la nouvelle structure
echo "2. Test création de module...\n";
$moduleData = [
    'nom' => 'Module Test ' . date('H:i:s')
];

$ch = curl_init($baseURL . '/modules');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($moduleData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "   ✗ Erreur: $error\n";
} else {
    echo "   ✓ Code HTTP: $httpCode\n";
    echo "   Réponse: " . substr($response, 0, 400) . "...\n";
    
    if ($httpCode == 201) {
        echo "   ✓ Module créé avec succès!\n";
    } else {
        echo "   ✗ Erreur lors de la création\n";
    }
}

echo "\n=== FIN DU TEST ===\n";
