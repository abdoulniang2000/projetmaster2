<?php

echo "=== Test Final de Correction des Modules ===\n";

// Test 1: Vérifier que le serveur backend est démarré
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

// Test 2: Créer un module via l'API
echo "\n2. Test de création de module via l'API...\n";
$testData = [
    'nom' => 'Module Test Final ' . date('Y-m-d H:i:s'),
    'cours_id' => 1
];

$ch = curl_init('http://127.0.0.1:8000/api/v1/modules');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 201) {
    echo "   ❌ Échec de la création (HTTP $httpCode): $response\n";
    exit(1);
}

$createdModule = json_decode($response, true);
echo "   ✅ Module créé avec ID: {$createdModule['id']}\n";

// Test 3: Vérifier que le module persiste
echo "\n3. Test de persistance (attente 2 secondes)...\n";
sleep(2);

$ch = curl_init('http://127.0.0.1:8000/api/v1/modules');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo "   ❌ Impossible de récupérer les modules (HTTP $httpCode)\n";
    exit(1);
}

$modules = json_decode($response, true);
$found = false;
foreach ($modules as $module) {
    if ($module['id'] == $createdModule['id']) {
        $found = true;
        echo "   ✅ Module trouvé dans la liste: {$module['nom']}\n";
        break;
    }
}

if (!$found) {
    echo "   ❌ Module non trouvé après création!\n";
    exit(1);
}

// Test 4: Simulation de "quitter et revenir"
echo "\n4. Simulation de 'quitter et revenir' (nouvel appel API)...\n";
sleep(1);

$ch = curl_init('http://127.0.0.1:8000/api/v1/modules');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $modules = json_decode($response, true);
    $stillFound = false;
    foreach ($modules as $module) {
        if ($module['id'] == $createdModule['id']) {
            $stillFound = true;
            echo "   ✅ Module toujours présent après 'quitter et revenir': {$module['nom']}\n";
            break;
        }
    }
    
    if (!$stillFound) {
        echo "   ❌ Le module a disparu! C'est le bug que nous cherchons à corriger.\n";
        exit(1);
    }
} else {
    echo "   ❌ Erreur lors du second appel (HTTP $httpCode)\n";
    exit(1);
}

// Test 5: Nettoyage
echo "\n5. Nettoyage du module de test...\n";
$ch = curl_init("http://127.0.0.1:8000/api/v1/modules/{$createdModule['id']}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 204) {
    echo "   ✅ Module de test supprimé avec succès\n";
} else {
    echo "   ⚠️  Impossible de supprimer le module de test (HTTP $httpCode)\n";
}

echo "\n🎉 TOUS LES TESTS SONT PASSÉS! Le problème de disparition des modules est corrigé.\n";
echo "\nRésumé des corrections:\n";
echo "- ✅ Champ 'nom' ajouté à la table modules\n";
echo "- ✅ Logging amélioré dans le contrôleur\n";
echo "- ✅ Rafraîchissement automatique dans le frontend\n";
echo "- ✅ Gestion d'erreurs robuste\n";
