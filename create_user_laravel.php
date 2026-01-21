<?php

echo "=== CRÉATION D'UTILISATEUR VIA MODÈLES LARAVEL ===\n\n";

// Charger l'environnement Laravel
require_once 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';

try {
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    echo "✓ Environnement Laravel chargé\n\n";
    
    // Créer un utilisateur via le modèle User
    echo "1. Création d'un utilisateur via le modèle User...\n";
    
    $timestamp = time();
    $userData = [
        'first_name' => 'Laravel',
        'last_name' => 'Test',
        'username' => 'laravel.test.' . $timestamp,
        'email' => 'laravel.test.' . $timestamp . '@example.com',
        'password' => bcrypt('password123'),
        'status' => true,
    ];
    
    $user = new \App\Models\User();
    foreach ($userData as $key => $value) {
        $user->$key = $value;
    }
    $user->save();
    
    echo "   ✓ Utilisateur créé avec ID: {$user->id}\n";
    echo "   ✓ Username: {$user->username}\n";
    echo "   ✓ Email: {$user->email}\n\n";
    
    // Attribuer un rôle
    echo "2. Attribution d'un rôle...\n";
    
    $defaultRole = \App\Models\Role::where('is_default', true)->first();
    if (!$defaultRole) {
        $defaultRole = \App\Models\Role::first();
    }
    
    if ($defaultRole) {
        $user->roles()->attach($defaultRole->id);
        echo "   ✓ Rôle '{$defaultRole->name}' attribué\n";
    } else {
        echo "   ⚠ Aucun rôle trouvé\n";
    }
    
    echo "\n3. Vérification de l'utilisateur créé:\n";
    
    // Recharger l'utilisateur avec ses rôles
    $user->load('roles');
    echo "   ✓ Utilisateur: {$user->full_name}\n";
    echo "   ✓ Rôles: ";
    foreach ($user->roles as $role) {
        echo "{$role->display_name} ";
    }
    echo "\n";
    
    // Tester les méthodes de rôle
    echo "   ✓ Est étudiant: " . ($user->estEtudiant() ? 'Oui' : 'Non') . "\n";
    echo "   ✓ Est enseignant: " . ($user->estEnseignant() ? 'Oui' : 'Non') . "\n";
    echo "   ✓ Est admin: " . ($user->estAdmin() ? 'Oui' : 'Non') . "\n";
    
    echo "\n=== SUCCÈS! ===\n";
    echo "Utilisateur créé avec succès via les modèles Laravel.\n";
    echo "Vous pouvez vous connecter avec:\n";
    echo "Email: {$user->email}\n";
    echo "Mot de passe: password123\n";
    
} catch (\Exception $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
    echo "Fichier: " . $e->getFile() . " (ligne " . $e->getLine() . ")\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
