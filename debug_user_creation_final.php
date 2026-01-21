<?php

// Définir les constantes Laravel pour éviter les erreurs
define('LARAVEL_START', microtime(true));

// Charger l'autoloader
require __DIR__ . '/backend/vendor/autoload.php';

// Créer l'application
$app = require_once __DIR__ . '/backend/bootstrap/app.php';

// Démarrer le kernel
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== DÉBOGAGE CRÉATION UTILISATEUR ===\n\n";

try {
    // 1. Vérifier la connexion à la base
    echo "1. CONNEXION BASE:\n";
    $db = \DB::connection();
    echo "   ✅ Base: " . $db->getDatabaseName() . "\n\n";
    
    // 2. Vérifier la structure de la table users
    echo "2. STRUCTURE TABLE USERS:\n";
    $columns = \Schema::getColumnListing('users');
    echo "   Colonnes: " . implode(', ', $columns) . "\n";
    
    // Vérifier si la colonne role existe
    if (in_array('role', $columns)) {
        echo "   ✅ Colonne 'role' existe\n";
    } else {
        echo "   ❌ Colonne 'role' MANQUANTE\n";
        // Ajouter la colonne si elle n'existe pas
        try {
            \Schema::table('users', function($table) {
                $table->string('role')->default('etudiant')->after('status');
            });
            echo "   ✅ Colonne 'role' ajoutée\n";
        } catch (Exception $e) {
            echo "   ❌ Impossible d'ajouter la colonne: " . $e->getMessage() . "\n";
        }
    }
    echo "\n";
    
    // 3. Vérifier les rôles disponibles
    echo "3. RÔLES DISPONIBLES:\n";
    $roles = \DB::table('roles')->get();
    foreach ($roles as $role) {
        echo "   - {$role->name} ({$role->display_name})\n";
    }
    echo "\n";
    
    // 4. Vérifier le modèle User
    echo "4. MODÈLE USER:\n";
    $user = new \App\Models\User();
    $fillable = $user->getFillable();
    echo "   Fillable: " . implode(', ', $fillable) . "\n";
    
    if (in_array('role', $fillable)) {
        echo "   ✅ 'role' est dans fillable\n";
    } else {
        echo "   ❌ 'role' n'est PAS dans fillable\n";
    }
    echo "\n";
    
    // 5. Test de création via modèle
    echo "5. TEST CRÉATION VIA MODÈLE:\n";
    try {
        $testData = [
            'first_name' => 'Test',
            'last_name' => 'User',
            'username' => 'test.user.' . time(),
            'email' => 'test.' . time() . '@example.com',
            'password' => \Hash::make('password123'),
            'role' => 'etudiant',
            'status' => 1
        ];
        
        $newUser = \App\Models\User::create($testData);
        echo "   ✅ Utilisateur créé - ID: {$newUser->id}\n";
        echo "   Email: {$newUser->email}\n";
        echo "   Role: {$newUser->role}\n";
        
        // Nettoyer
        $newUser->delete();
        echo "   ✅ Utilisateur supprimé\n";
        
    } catch (Exception $e) {
        echo "   ❌ Erreur création: " . $e->getMessage() . "\n";
        echo "   Trace: " . $e->getTraceAsString() . "\n";
    }
    echo "\n";
    
    // 6. Vérifier les logs Laravel
    echo "6. LOGS LARAVEL:\n";
    $logFile = __DIR__ . '/backend/storage/logs/laravel.log';
    if (file_exists($logFile)) {
        $logs = file_get_contents($logFile);
        $recentLogs = substr($logs, -2000); // Derniers 2000 caractères
        echo "   Derniers logs:\n";
        echo "   " . str_replace("\n", "\n   ", $recentLogs) . "\n";
    } else {
        echo "   ❌ Fichier de log non trouvé\n";
    }
    
} catch (Exception $e) {
    echo "❌ ERREUR GÉNÉRALE: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}

echo "\n=== FIN ===\n";
