<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ShowUsersLogs extends Command
{
    protected $signature = 'logs:users {--tail=50 : Nombre de lignes à afficher} {--filter= : Filtrer par mot-clé}';
    protected $description = 'Afficher les logs de récupération des utilisateurs';

    public function handle()
    {
        $logFile = storage_path('logs/laravel.log');
        $tail = $this->option('tail');
        $filter = $this->option('filter');

        if (!File::exists($logFile)) {
            $this->error('Fichier de logs non trouvé : ' . $logFile);
            return 1;
        }

        $this->info('📋 Affichage des logs utilisateurs...');
        $this->info('📁 Fichier : ' . $logFile);
        $this->info('🔍 Filtre : ' . ($filter ?: 'aucun'));
        $this->info('📏 Lignes : ' . $tail);
        $this->line(str_repeat('=', 80));

        // Lire le fichier et filtrer
        $lines = $this->readLogFile($logFile, $tail, $filter);

        if (empty($lines)) {
            $this->warn('Aucun log trouvé avec les critères spécifiés');
            return 0;
        }

        // Afficher les logs avec coloration
        foreach ($lines as $line) {
            $this->colorizeLogLine($line);
        }

        $this->line(str_repeat('=', 80));
        $this->info('✅ Fin des logs');

        return 0;
    }

    private function readLogFile($file, $tail, $filter)
    {
        $content = file_get_contents($file);
        $lines = explode("\n", $content);
        
        // Prendre les dernières lignes
        $lines = array_slice($lines, -$tail);
        
        // Filtrer si nécessaire
        if ($filter) {
            $lines = array_filter($lines, function($line) use ($filter) {
                return stripos($line, $filter) !== false;
            });
        }
        
        return array_values($lines);
    }

    private function colorizeLogLine($line)
    {
        if (empty(trim($line))) {
            $this->line($line);
            return;
        }

        // Coloration selon le niveau de log
        if (strpos($line, 'ERROR') !== false || strpos($line, 'ERREUR') !== false) {
            $this->error($line);
        } elseif (strpos($line, 'WARNING') !== false) {
            $this->warn($line);
        } elseif (strpos($line, 'INFO') !== false) {
            $this->info($line);
        } elseif (strpos($line, '===') !== false) {
            $this->line('<fg=cyan;options=bold>' . $line . '</>');
        } else {
            $this->line($line);
        }
    }
}
