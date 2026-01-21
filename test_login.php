<?php

// Test de connexion direct avec Laravel
require_once 'backend/bootstrap/app.php';

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

echo "=== TEST DE CONNEXION ===\n\n";

$email = 'abdoilniang00@gmail.com';
$password = 'passer';

// 1. Vérifier l'utilisateur dans la base de données
$user = DB::table('users')->where('email', $email)->first();

if (!$user) {
    echo "❌ Utilisateur non trouvé: $email\n";
    exit;
}

echo "✅ Utilisateur trouvé:\n";
echo "- ID: {$user->id}\n";
echo "- Nom: {$user->first_name} {$user->last_name}\n";
echo "- Email: {$user->email}\n";
echo "- Rôle: {$user->role}\n";
echo "- Statut: {$user->status}\n";

// 2. Vérifier le mot de passe
echo "\n=== VÉRIFICATION MOT DE PASSE ===\n";

// Test avec password_verify
if (password_verify($password, $user->password)) {
    echo "✅ Mot de passe correct avec password_verify()\n";
} else {
    echo "❌ Mot de passe incorrect avec password_verify()\n";
    
    // Test avec Hash::check de Laravel
    if (Hash::check($password, $user->password)) {
        echo "✅ Mot de passe correct avec Hash::check()\n";
    } else {
        echo "❌ Mot de passe incorrect avec Hash::check()\n";
        
        // Créer un nouveau hash
        $newHash = Hash::make($password);
        echo "Nouveau hash généré: $newHash\n";
        
        // Mettre à jour
        DB::table('users')
            ->where('id', $user->id)
            ->update(['password' => $newHash]);
        
        echo "✅ Mot de passe mis à jour dans la base de données\n";
    }
}

// 3. Vérifier les rôles
echo "\n=== VÉRIFICATION DES RÔLES ===\n";

// Vérifier user_roles
$userRoles = DB::table('user_roles')
    ->join('roles', 'user_roles.role_id', '=', 'roles.id')
    ->where('user_roles.user_id', $user->id)
    ->select('roles.name', 'roles.display_name')
    ->get();

echo "Rôles dans user_roles:\n";
if ($userRoles->count() > 0) {
    foreach ($userRoles as $role) {
        echo "- {$role->name} ({$role->display_name})\n";
    }
} else {
    echo "- Aucun rôle trouvé\n";
    
    // Ajouter le rôle admin
    $adminRole = DB::table('roles')->where('name', 'admin')->first();
    if ($adminRole) {
        DB::table('user_roles')->insert([
            'user_id' => $user->id,
            'role_id' => $adminRole->id,
            'created_at' => now(),
            'updated_at' => now()
        ]);
        echo "✅ Rôle admin ajouté\n";
    }
}

// 4. Test final
echo "\n=== TEST FINAL ===\n";
echo "📧 Email: $email\n";
echo "🔑 Mot de passe: $password\n";
echo "👤 Rôle: admin\n";

$updatedUser = DB::table('users')->where('id', $user->id)->first();
if (Hash::check($password, $updatedUser->password)) {
    echo "✅ Test de mot de passe réussi !\n";
} else {
    echo "❌ Test de mot de passe échoué\n";
}

echo "\n✅ Terminé ! Essayez de vous connecter.\n";
?>
