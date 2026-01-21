<?php

// Connexion directe à la base
$pdo = new PDO('mysql:host=localhost;dbname=mastercampus', 'root', '');

echo "=== VÉRIFICATION DES RÔLES ===\n\n";

// 1. Vérifier la table roles
echo "1. TABLE ROLES:\n";
$stmt = $pdo->query("SELECT * FROM roles");
$roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($roles)) {
    echo "   ❌ AUCUN RÔLE TROUVÉ\n";
    
    // Créer les rôles de base
    echo "\n2. CRÉATION DES RÔLES DE BASE:\n";
    
    $rolesToCreate = [
        ['name' => 'admin', 'display_name' => 'Administrateur'],
        ['name' => 'enseignant', 'display_name' => 'Enseignant'],
        ['name' => 'etudiant', 'display_name' => 'Étudiant']
    ];
    
    foreach ($rolesToCreate as $role) {
        $stmt = $pdo->prepare("INSERT INTO roles (name, display_name, created_at, updated_at) VALUES (?, ?, NOW(), NOW())");
        $stmt->execute([$role['name'], $role['display_name']]);
        echo "   ✅ Rôle '{$role['name']}' créé\n";
    }
    
    // Re-vérifier
    echo "\n3. VÉRIFICATION APRÈS CRÉATION:\n";
    $stmt = $pdo->query("SELECT * FROM roles");
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($roles as $role) {
        echo "   - ID: {$role['id']}, Name: '{$role['name']}', Display: '{$role['display_name']}'\n";
    }
    
} else {
    echo "   ✅ Rôles trouvés:\n";
    foreach ($roles as $role) {
        echo "   - ID: {$role['id']}, Name: '{$role['name']}', Display: '{$role['display_name']}'\n";
    }
}

echo "\n=== FIN ===\n";
