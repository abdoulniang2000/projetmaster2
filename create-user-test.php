<?php

require_once 'backend/vendor/autoload.php';

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

// Configuration Laravel
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Test de création d'utilisateur ===\n\n";

try {
    // Vérifier la connexion à la base de données
    echo "1. Test de connexion à la base de données...\n";
    $tables = DB::select('SHOW TABLES');
    echo "   ✓ Connexion réussie. Tables trouvées: " . count($tables) . "\n\n";

    // Vérifier les tables nécessaires
    echo "2. Vérification des tables nécessaires...\n";
    $requiredTables = ['users', 'roles', 'role_user'];
    foreach ($requiredTables as $table) {
        $exists = DB::select("SHOW TABLES LIKE '$table'");
        if ($exists) {
            echo "   ✓ Table '$table' existe\n";
        } else {
            echo "   ✗ Table '$table' manquante\n";
        }
    }
    echo "\n";

    // Vérifier les rôles existants
    echo "3. Vérification des rôles existants...\n";
    $roles = DB::table('roles')->get();
    echo "   Rôles trouvés: " . $roles->count() . "\n";
    foreach ($roles as $role) {
        echo "   - {$role->name} ({$role->display_name})\n";
    }
    echo "\n";

    // Vérifier les utilisateurs existants
    echo "4. Vérification des utilisateurs existants...\n";
    $users = DB::table('users')->get();
    echo "   Utilisateurs trouvés: " . $users->count() . "\n";
    foreach ($users as $user) {
        echo "   - {$user->username} ({$user->email})\n";
    }
    echo "\n";

    // Créer un utilisateur de test
    echo "5. Création d'un utilisateur de test...\n";
    
    $userData = [
        'first_name' => 'Test',
        'last_name' => 'User',
        'username' => 'test.user.' . time(),
        'email' => 'test' . time() . '@example.com',
        'password' => Hash::make('password123'),
        'status' => true,
    ];

    try {
        // Insérer l'utilisateur
        $userId = DB::table('users')->insertGetId($userData);
        echo "   ✓ Utilisateur créé avec ID: $userId\n";

        // Attribuer un rôle par défaut
        $defaultRole = DB::table('roles')->where('is_default', true)->first();
        if ($defaultRole) {
            DB::table('role_user')->insert([
                'user_id' => $userId,
                'role_id' => $defaultRole->id
            ]);
            echo "   ✓ Rôle '{$defaultRole->name}' attribué\n";
        } else {
            echo "   ⚠ Aucun rôle par défaut trouvé\n";
        }

        // Vérifier l'utilisateur créé
        $createdUser = DB::table('users')->where('id', $userId)->first();
        echo "   ✓ Utilisateur vérifié: {$createdUser->username}\n";

    } catch (\Exception $e) {
        echo "   ✗ Erreur lors de la création: " . $e->getMessage() . "\n";
        echo "   Code erreur: " . $e->getCode() . "\n";
    }

    echo "\n6. Test d'authentification...\n";
    
    // Tester avec l'utilisateur créé
    $testUser = DB::table('users')->where('email', $userData['email'])->first();
    if ($testUser) {
        if (Hash::check('password123', $testUser->password)) {
            echo "   ✓ Authentification réussie\n";
        } else {
            echo "   ✗ Échec de l'authentification\n";
        }
    }

    echo "\n=== Test terminé ===\n";

} catch (\Exception $e) {
    echo "ERREUR GLOBALE: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
