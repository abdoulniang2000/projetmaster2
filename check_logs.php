<?php

$logFile = 'backend/storage/logs/laravel.log';
if (file_exists($logFile)) {
    $logs = file_get_contents($logFile);
    $lines = explode("\n", $logs);
    
    echo "=== 50 dernières lignes des logs Laravel ===\n";
    foreach (array_slice($lines, -50) as $line) {
        echo $line . "\n";
    }
} else {
    echo "Fichier de logs non trouvé\n";
}
