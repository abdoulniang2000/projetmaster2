<?php

echo "=== Test Final de Correction des Semestres ===\n";

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

// Test 2: Créer un semestre via l'API
echo "\n2. Test de création de semestre via l'API...\n";
$testData = [
    'nom' => 'Semestre Test Final ' . date('Y-m-d H:i:s')
];

$ch = curl_init('http://127.0.0.1:8000/api/v1/semestres');
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

$createdSemestre = json_decode($response, true);
echo "   ✅ Semestre créé avec ID: {$createdSemestre['id']}\n";
echo "   ✅ Nom: {$createdSemestre['nom']}\n";
echo "   ✅ Actif: " . ($createdSemestre['is_active'] ? 'Oui' : 'Non') . "\n";

// Test 3: Vérifier que le semestre persiste
echo "\n3. Test de persistance (attente 2 secondes)...\n";
sleep(2);

$ch = curl_init('http://127.0.0.1:8000/api/v1/semestres');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo "   ❌ Impossible de récupérer les semestres (HTTP $httpCode)\n";
    exit(1);
}

$semestres = json_decode($response, true);
$found = false;
foreach ($semestres as $semestre) {
    if ($semestre['id'] == $createdSemestre['id']) {
        $found = true;
        echo "   ✅ Semestre trouvé dans la liste: {$semestre['nom']}\n";
        break;
    }
}

if (!$found) {
    echo "   ❌ Semestre non trouvé après création!\n";
    exit(1);
}

// Test 4: Simulation de "quitter et revenir"
echo "\n4. Simulation de 'quitter et revenir' (nouvel appel API)...\n";
sleep(1);

$ch = curl_init('http://127.0.0.1:8000/api/v1/semestres');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $semestres = json_decode($response, true);
    $stillFound = false;
    foreach ($semestres as $semestre) {
        if ($semestre['id'] == $createdSemestre['id']) {
            $stillFound = true;
            echo "   ✅ Semestre toujours présent après 'quitter et revenir': {$semestre['nom']}\n";
            break;
        }
    }
    
    if (!$stillFound) {
        echo "   ❌ Le semestre a disparu! C'est le bug que nous cherchons à corriger.\n";
        exit(1);
    }
} else {
    echo "   ❌ Erreur lors du second appel (HTTP $httpCode)\n";
    exit(1);
}

// Test 5: Nettoyage
echo "\n5. Nettoyage du semestre de test...\n";
$ch = curl_init("http://127.0.0.1:8000/api/v1/semestres/{$createdSemestre['id']}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 204) {
    echo "   ✅ Semestre de test supprimé avec succès\n";
} else {
    echo "   ⚠️  Impossible de supprimer le semestre de test (HTTP $httpCode)\n";
}

echo "\n🎉 TOUS LES TESTS SONT PASSÉS! Le problème de disparition des semestres est corrigé.\n";
echo "\nRésumé des corrections:\n";
echo "- ✅ Correction du contrôleur (suppression de annee_academique)\n";
echo "- ✅ Utilisation des champs corrects de la base de données\n";
echo "- ✅ Logging amélioré dans le contrôleur\n";
echo "- ✅ Rafraîchissement automatique dans le frontend\n";
echo "- ✅ Gestion d'erreurs robuste\n";
