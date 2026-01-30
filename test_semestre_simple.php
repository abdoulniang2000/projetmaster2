<?php

echo "=== Test simple de création de semestre ===\n";

// Test 1: Vérifier le serveur
echo "1. Test du serveur backend...\n";
$ch = curl_init('http://127.0.0.1:8000/api/v1/test');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo "   ❌ Serveur backend non démarré. Veuillez lancer: php artisan serve --host=127.0.0.1 --port=8000\n";
    exit(1);
}
echo "   ✅ Serveur backend opérationnel\n";

// Test 2: Créer un semestre simple
echo "\n2. Test de création de semestre simple...\n";
$testData = [
    'nom' => 'Semestre Test ' . date('H:i:s')
];

echo "   Données envoyées: " . json_encode($testData) . "\n";

$ch = curl_init('http://127.0.0.1:8000/api/v1/semestres');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   Code HTTP: $httpCode\n";
echo "   Réponse: $response\n";

if ($httpCode === 201) {
    echo "   ✅ Semestre créé avec succès!\n";
    $semestre = json_decode($response, true);
    echo "   ID: {$semestre['id']}, Nom: {$semestre['nom']}\n";
    
    // Vérifier qu'il persiste
    echo "\n3. Vérification de la persistance...\n";
    sleep(1);
    
    $ch = curl_init('http://127.0.0.1:8000/api/v1/semestres');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
    curl_close($ch);
    
    $semestres = json_decode($response, true);
    $found = false;
    foreach ($semestres as $s) {
        if ($s['id'] == $semestre['id']) {
            $found = true;
            echo "   ✅ Semestre trouvé dans la liste: {$s['nom']}\n";
            break;
        }
    }
    
    if (!$found) {
        echo "   ❌ Semestre non trouvé après création!\n";
    }
    
    // Nettoyer
    $ch = curl_init("http://127.0.0.1:8000/api/v1/semestres/{$semestre['id']}");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_exec($ch);
    curl_close($ch);
    echo "   ✅ Nettoyage effectué\n";
    
} else {
    echo "   ❌ Erreur lors de la création\n";
    
    if ($httpCode === 500) {
        echo "   C'est une erreur serveur. Vérifions les logs...\n";
        
        // Essayer de voir les logs Laravel
        $logFile = 'backend/storage/logs/laravel.log';
        if (file_exists($logFile)) {
            $logs = file_get_contents($logFile);
            $recentLogs = substr($logs, -1000);
            echo "   Logs récents:\n";
            echo "   " . str_replace("\n", "\n   ", $recentLogs) . "\n";
        }
    }
}

echo "\n=== Test terminé ===\n";
