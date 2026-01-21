<?php

require_once 'backend/bootstrap/app.php';

use Illuminate\Support\Facades\DB;

echo "=== VÉRIFICATION DU RÔLE DE ABDOUL NIANG ===\n\n";

// Vérifier l'utilisateur
$user = DB::table('users')->where('email', 'abdoilniang00@gmail.com')->first();

if ($user) {
    echo "Utilisateur trouvé:\n";
    echo "- ID: {$user->id}\n";
    echo "- Nom: {$user->first_name} {$user->last_name}\n";
    echo "- Email: {$user->email}\n";
    echo "- Rôle (colonne users.role): {$user->role}\n\n";
    
    // Vérifier les rôles dans user_roles
    $userRoles = DB::table('user_roles')
        ->join('roles', 'user_roles.role_id', '=', 'roles.id')
        ->where('user_roles.user_id', $user->id)
        ->select('roles.name', 'roles.display_name')
        ->get();
    
    echo "Rôles dans la table user_roles:\n";
    if ($userRoles->count() > 0) {
        foreach ($userRoles as $role) {
            echo "- {$role->name} ({$role->display_name})\n";
        }
    } else {
        echo "- Aucun rôle trouvé dans user_roles\n";
    }
    
    echo "\n=== CORRECTION EN COURS ===\n";
    
    // Mettre à jour la colonne role
    DB::table('users')
        ->where('id', $user->id)
        ->update(['role' => 'admin']);
    
    echo "✓ Colonne role mise à jour à 'admin'\n";
    
    // Supprimer les anciens rôles
    DB::table('user_roles')->where('user_id', $user->id)->delete();
    echo "✓ Anciens rôles supprimés de user_roles\n";
    
    // Ajouter le rôle admin
    $adminRole = DB::table('roles')->where('name', 'admin')->first();
    if ($adminRole) {
        DB::table('user_roles')->insert([
            'user_id' => $user->id,
            'role_id' => $adminRole->id,
            'created_at' => now(),
            'updated_at' => now()
        ]);
        echo "✓ Rôle admin ajouté dans user_roles\n";
    }
    
    echo "\n=== VÉRIFICATION FINALE ===\n";
    
    // Vérifier après correction
    $userUpdated = DB::table('users')->where('id', $user->id)->first();
    echo "Rôle (colonne users.role): {$userUpdated->role}\n";
    
    $userRolesUpdated = DB::table('user_roles')
        ->join('roles', 'user_roles.role_id', '=', 'roles.id')
        ->where('user_roles.user_id', $user->id)
        ->select('roles.name', 'roles.display_name')
        ->get();
    
    echo "Rôles dans user_roles:\n";
    foreach ($userRolesUpdated as $role) {
        echo "- {$role->name} ({$role->display_name})\n";
    }
    
    echo "\n✅ Correction terminée ! Essayez de vous connecter maintenant.\n";
    
} else {
    echo "❌ Utilisateur non trouvé avec l'email abdoilniang00@gmail.com\n";
}
