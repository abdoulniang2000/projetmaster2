<?php

// Connexion directe à la base de données
$host = '127.0.0.1';
$dbname = 'mastercampus';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "=== CORRECTION DU RÔLE DE ABDOUL NIANG ===\n\n";
    
    // 1. Vérifier l'utilisateur
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute(['abdoilniang00@gmail.com']);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo "Utilisateur trouvé:\n";
        echo "- ID: {$user['id']}\n";
        echo "- Nom: {$user['first_name']} {$user['last_name']}\n";
        echo "- Email: {$user['email']}\n";
        echo "- Rôle actuel: {$user['role']}\n\n";
        
        // 2. Mettre à jour la colonne role
        $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->execute(['admin', $user['id']]);
        echo "✓ Colonne role mise à jour à 'admin'\n";
        
        // 3. Supprimer les anciens rôles dans user_roles
        $stmt = $pdo->prepare("DELETE FROM user_roles WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        echo "✓ Anciens rôles supprimés de user_roles\n";
        
        // 4. Ajouter le rôle admin dans user_roles
        $stmt = $pdo->prepare("SELECT id FROM roles WHERE name = ?");
        $stmt->execute(['admin']);
        $role = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($role) {
            $stmt = $pdo->prepare("INSERT INTO user_roles (user_id, role_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())");
            $stmt->execute([$user['id'], $role['id']]);
            echo "✓ Rôle admin ajouté dans user_roles\n";
        }
        
        // 5. Vérification finale
        echo "\n=== VÉRIFICATION FINALE ===\n";
        $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->execute([$user['id']]);
        $updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "Rôle dans users.role: {$updatedUser['role']}\n";
        
        $stmt = $pdo->prepare("
            SELECT r.name, r.display_name 
            FROM user_roles ur 
            JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = ?
        ");
        $stmt->execute([$user['id']]);
        $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "Rôles dans user_roles:\n";
        foreach ($roles as $role) {
            echo "- {$role['name']} ({$role['display_name']})\n";
        }
        
        echo "\n✅ Correction terminée !\n";
        echo "📧 Email: abdoilniang00@gmail.com\n";
        echo "🔑 Mot de passe: passer\n";
        echo "👤 Rôle: admin\n";
        
    } else {
        echo "❌ Utilisateur non trouvé\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Erreur de base de données: " . $e->getMessage() . "\n";
}
?>
