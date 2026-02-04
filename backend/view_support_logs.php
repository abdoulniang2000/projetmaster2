<?php

// Script pour afficher les logs Laravel de manière structurée
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$logFile = __DIR__ . '/storage/logs/laravel.log';

if (!file_exists($logFile)) {
    echo "Fichier de log non trouvé : $logFile\n";
    exit(1);
}

echo "=== LOGS LARAVEL - SUPPORTS PÉDAGOGIQUES ===\n\n";
echo "Dernière modification : " . date('Y-m-d H:i:s', filemtime($logFile)) . "\n";
echo "Taille du fichier : " . number_format(filesize($logFile)) . " octets\n\n";

// Lire les 100 dernières lignes
$lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$lastLines = array_slice($lines, -100);

// Filtrer les logs liés aux supports pédagogiques
$supportLogs = [];
$errorLogs = [];
$warningLogs = [];

foreach ($lastLines as $line) {
    if (strpos($line, 'support') !== false || 
        strpos($line, 'Support') !== false || 
        strpos($line, 'pédagogique') !== false) {
        $supportLogs[] = $line;
    }
    
    if (strpos($line, 'ERROR') !== false || strpos($line, 'error') !== false) {
        $errorLogs[] = $line;
    }
    
    if (strpos($line, 'WARNING') !== false || strpos($line, 'warning') !== false) {
        $warningLogs[] = $line;
    }
}

// Afficher les logs de supports pédagogiques
if (!empty($supportLogs)) {
    echo "📚 LOGS DES SUPPORTS PÉDAGOGIQUES :\n";
    echo str_repeat("=", 50) . "\n";
    foreach ($supportLogs as $log) {
        echo $log . "\n";
    }
    echo "\n";
} else {
    echo "📚 Aucun log de support pédagogique trouvé récemment\n\n";
}

// Afficher les erreurs
if (!empty($errorLogs)) {
    echo "❌ LOGS D'ERREURS :\n";
    echo str_repeat("=", 50) . "\n";
    foreach ($errorLogs as $log) {
        echo $log . "\n";
    }
    echo "\n";
} else {
    echo "❌ Aucune erreur trouvée récemment\n\n";
}

// Afficher les avertissements
if (!empty($warningLogs)) {
    echo "⚠️  LOGS D'AVERTISSEMENTS :\n";
    echo str_repeat("=", 50) . "\n";
    foreach ($warningLogs as $log) {
        echo $log . "\n";
    }
    echo "\n";
} else {
    echo "⚠️  Aucun avertissement trouvé récemment\n\n";
}

// Afficher les 10 dernières lignes du fichier
echo "📋 DERNIÈRES LIGNES DU FICHIER DE LOG :\n";
echo str_repeat("=", 50) . "\n";
foreach (array_slice($lines, -10) as $line) {
    echo $line . "\n";
}

echo "\n=== FIN DES LOGS ===\n";
