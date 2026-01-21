<?php

require_once __DIR__ . '/backend/vendor/autoload.php';

$app = require_once __DIR__ . '/backend/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== VÉRIFICATION DE LA STRUCTURE DE LA BASE DE DONNÉES ===\n\n";

// 1. Vérifier la table users
echo "1. TABLE USERS:\n";
$usersColumns = \Schema::getColumnListing('users');
echo "   Colonnes: " . implode(', ', $usersColumns) . "\n";
echo "   Nombre de colonnes: " . count($usersColumns) . "\n\n";

// 2. Vérifier la table roles
echo "2. TABLE ROLES:\n";
$rolesColumns = \Schema::getColumnListing('roles');
echo "   Colonnes: " . implode(', ', $rolesColumns) . "\n";
echo "   Nombre de colonnes: " . count($rolesColumns) . "\n\n";

// 3. Vérifier la table user_roles
echo "3. TABLE USER_ROLES:\n";
try {
    $userRolesColumns = \Schema::getColumnListing('user_roles');
    echo "   Colonnes: " . implode(', ', $userRolesColumns) . "\n";
    echo "   Nombre de colonnes: " . count($userRolesColumns) . "\n\n";
} catch (Exception $e) {
    echo "   ❌ ERREUR: " . $e->getMessage() . "\n\n";
}

// 4. Vérifier les données dans roles
echo "4. DONNÉES DANS ROLES:\n";
try {
    $roles = \DB::table('roles')->get();
    echo "   Nombre de rôles: " . $roles->count() . "\n";
    foreach ($roles as $role) {
        echo "   - ID: {$role->id}, Nom: {$role->name}, Display: {$role->display_name}\n";
    }
} catch (Exception $e) {
    echo "   ❌ ERREUR: " . $e->getMessage() . "\n";
}
echo "\n";

// 5. Vérifier les données dans users
echo "5. DONNÉES DANS USERS:\n";
try {
    $users = \DB::table('users')->limit(3)->get();
    echo "   Nombre total d'utilisateurs: " . \DB::table('users')->count() . "\n";
    foreach ($users as $user) {
        echo "   - ID: {$user->id}, Email: {$user->email}, Role: " . ($user->role ?? 'NULL') . "\n";
    }
} catch (Exception $e) {
    echo "   ❌ ERREUR: " . $e->getMessage() . "\n";
}
echo "\n";

// 6. Vérifier les relations user_roles si la table existe
echo "6. RELATIONS USER_ROLES:\n";
try {
    $userRoles = \DB::table('user_roles')->limit(3)->get();
    echo "   Nombre total de relations: " . \DB::table('user_roles')->count() . "\n";
    foreach ($userRoles as $relation) {
        echo "   - User ID: {$relation->user_id}, Role ID: {$relation->role_id}\n";
    }
} catch (Exception $e) {
    echo "   ❌ ERREUR: " . $e->getMessage() . "\n";
}
echo "\n";

// 7. Tester la création d'un utilisateur simple
echo "7. TEST DE CRÉATION D'UTILISATEUR:\n";
try {
    $userData = [
        'first_name' => 'Test',
        'last_name' => 'User',
        'username' => 'test.user.' . time(),
        'email' => 'test.' . time() . '@example.com',
        'password' => \Hash::make('password123'),
        'role' => 'etudiant',
        'status' => 1
    ];
    
    $user = \App\Models\User::create($userData);
    echo "   ✅ Utilisateur créé avec succès - ID: {$user->id}\n";
    echo "   Email: {$user->email}\n";
    echo "   Role: {$user->role}\n";
    
    // Nettoyer
    $user->delete();
    echo "   ✅ Utilisateur de test supprimé\n";
    
} catch (Exception $e) {
    echo "   ❌ ERREUR: " . $e->getMessage() . "\n";
    echo "   Trace: " . $e->getTraceAsString() . "\n";
}

echo "\n=== FIN DE LA VÉRIFICATION ===\n";
