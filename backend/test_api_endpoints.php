<?php

echo "=== Test des endpoints API ===\n";

// Test avec cURL si disponible
function testEndpoint($method, $url, $data = null) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'status_code' => $httpCode,
        'response' => json_decode($response, true)
    ];
}

$baseUrl = 'http://localhost:8000/api/v1';

echo "1. Test création département...\n";
$departementData = [
    'nom' => 'Informatique',
    'code' => 'INFO',
    'description' => 'Département informatique'
];
$result = testEndpoint('POST', $baseUrl . '/departements', $departementData);
echo "Status: " . $result['status_code'] . "\n";
echo "Response: " . json_encode($result['response']) . "\n\n";

if ($result['status_code'] == 201 && isset($result['response']['id'])) {
    $departementId = $result['response']['id'];
    
    echo "2. Test création semestre...\n";
    $semestreData = [
        'nom' => 'Semestre 1',
        'description' => 'Premier semestre'
    ];
    $result = testEndpoint('POST', $baseUrl . '/semestres', $semestreData);
    echo "Status: " . $result['status_code'] . "\n";
    echo "Response: " . json_encode($result['response']) . "\n\n";
    
    echo "3. Test création matière...\n";
    $matiereData = [
        'nom' => 'Mathématiques',
        'code' => 'MAT101',
        'description' => 'Mathématiques fondamentales',
        'departement_id' => $departementId,
        'credits' => 3
    ];
    $result = testEndpoint('POST', $baseUrl . '/matieres', $matiereData);
    echo "Status: " . $result['status_code'] . "\n";
    echo "Response: " . json_encode($result['response']) . "\n\n";
}

echo "4. Test récupération des données...\n";
$endpoints = ['/departements', '/semestres', '/matieres'];
foreach ($endpoints as $endpoint) {
    echo "Testing $endpoint...\n";
    $result = testEndpoint('GET', $baseUrl . $endpoint);
    echo "Status: " . $result['status_code'] . "\n";
    echo "Count: " . (is_array($result['response']) ? count($result['response']) : 0) . " enregistrements\n\n";
}

echo "Test terminé.\n";
