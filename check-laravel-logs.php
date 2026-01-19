<?php

// Script pour vérifier les erreurs récentes dans les logs Laravel
// À exécuter avec: php check-laravel-logs.php

$logFile = __DIR__ . '/backend/storage/logs/laravel.log';

if (!file_exists($logFile)) {
    echo "❌ Fichier de logs non trouvé: $logFile\n";
    exit(1);
}

echo "🔍 DERNIÈRES ERREURS LARAVEL\n";
echo "============================\n\n";

// Lire les dernières lignes du fichier
$lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$recentLines = array_slice($lines, -50); // 50 dernières lignes

// Chercher les erreurs récentes
$errors = [];
foreach ($recentLines as $line) {
    if (strpos($line, 'ERROR') !== false || 
        strpos($line, 'Exception') !== false || 
        strpos($line, 'Fatal') !== false) {
        $errors[] = $line;
    }
}

if (empty($errors)) {
    echo "✅ Aucune erreur récente trouvée dans les logs\n\n";
    
    // Afficher les 10 dernières lignes quand même
    echo "📄 10 dernières lignes du log:\n";
    echo "=============================\n";
    foreach (array_slice($recentLines, -10) as $line) {
        echo $line . "\n";
    }
} else {
    echo "❌ Erreurs trouvées:\n\n";
    
    foreach (array_slice($errors, -10) as $error) {
        echo $error . "\n";
    }
}

echo "\n🎯 Actions recommandées:\n";
echo "====================\n";

// Vérifier les problèmes courants
$logContent = implode("\n", $recentLines);

if (strpos($logContent, 'Column not found') !== false) {
    echo "🗄️  PROBLÈME: Colonne manquante dans la base\n";
    echo "💡 SOLUTION: php artisan migrate\n\n";
}

if (strpos($logContent, 'Connection refused') !== false) {
    echo "🔌 PROBLÈME: Connexion base de données refusée\n";
    echo "💡 SOLUTION: Vérifier que MySQL/MariaDB est démarré\n\n";
}

if (strpos($logContent, 'SQLSTATE') !== false) {
    echo "🗄️  PROBLÈME: Erreur SQL\n";
    echo "💡 SOLUTION: Vérifier la structure de la base\n\n";
}

if (strpos($logContent, 'permission') !== false || strpos($logContent, 'unauthorized') !== false) {
    echo "🔐 PROBLÈME: Problème de permissions\n";
    echo "💡 SOLUTION: Vérifier les policies Laravel\n\n";
}

if (strpos($logContent, 'store()') !== false && strpos($logContent, 'UserController') !== false) {
    echo "👤 PROBLÈME: Erreur dans la création d'utilisateur\n";
    echo "💡 SOLUTION: Vérifier le StoreUserRequest et le modèle User\n\n";
}

echo "📋 Pour voir les logs en temps réel:\n";
echo "   cd backend && tail -f storage/logs/laravel.log\n\n";

echo "🚀 Pour tester l'API directement:\n";
echo "   curl -X POST http://127.0.0.1:8001/api/v1/users \\\n";
echo "        -H \"Content-Type: application/json\" \\\n";
echo "        -d '{\"first_name\":\"Test\",\"last_name\":\"User\",\"email\":\"test@test.com\",\"password\":\"password123\",\"role\":\"etudiant\"}'\n";
