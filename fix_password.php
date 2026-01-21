<?php

// Connexion directe à la base de données
$host = '127.0.0.1';
$dbname = 'mastercampus';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "=== VÉRIFICATION ET CORRECTION DU MOT DE PASSE ===\n\n";
    
    // 1. Vérifier l'utilisateur
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute(['abdoilniang00@gmail.com']);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo "Utilisateur trouvé:\n";
        echo "- ID: {$user['id']}\n";
        echo "- Nom: {$user['first_name']} {$user['last_name']}\n";
        echo "- Email: {$user['email']}\n";
        echo "- Rôle: {$user['role']}\n";
        echo "- Mot de passe actuel: {$user['password']}\n\n";
        
        // 2. Mettre à jour le mot de passe avec le hash correct pour "passer"
        $hash = password_hash('passer', PASSWORD_DEFAULT);
        echo "Nouveau hash pour 'passer': $hash\n\n";
        
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->execute([$hash, $user['id']]);
        echo "✅ Mot de passe mis à jour avec succès !\n\n";
        
        // 3. Vérifier le rôle
        echo "=== VÉRIFICATION DU RÔLE ===\n";
        
        // Vérifier la colonne role
        echo "Rôle dans users.role: {$user['role']}\n";
        
        // Mettre à jour le rôle si nécessaire
        if ($user['role'] !== 'admin') {
            $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
            $stmt->execute(['admin', $user['id']]);
            echo "✅ Rôle mis à jour à 'admin'\n";
        }
        
        // Vérifier user_roles
        $stmt = $pdo->prepare("
            SELECT r.name, r.display_name 
            FROM user_roles ur 
            JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = ?
        ");
        $stmt->execute([$user['id']]);
        $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "Rôles dans user_roles:\n";
        if (empty($roles)) {
            echo "- Aucun rôle trouvé\n";
            // Ajouter le rôle admin
            $stmt = $pdo->prepare("SELECT id FROM roles WHERE name = ?");
            $stmt->execute(['admin']);
            $role = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($role) {
                $stmt = $pdo->prepare("INSERT INTO user_roles (user_id, role_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())");
                $stmt->execute([$user['id'], $role['id']]);
                echo "✅ Rôle admin ajouté dans user_roles\n";
            }
        } else {
            foreach ($roles as $role) {
                echo "- {$role['name']} ({$role['display_name']})\n";
            }
        }
        
        // 4. Test du mot de passe
        echo "\n=== TEST DU MOT DE PASSE ===\n";
        $testPassword = 'passer';
        if (password_verify($testPassword, $hash)) {
            echo "✅ Le mot de passe '$testPassword' est correctement hashé\n";
        } else {
            echo "❌ Le mot de passe '$testPassword' ne correspond pas au hash\n";
        }
        
        echo "\n=== RÉCAPITULATIF ===\n";
        echo "📧 Email: abdoilniang00@gmail.com\n";
        echo "🔑 Mot de passe: passer\n";
        echo "👤 Rôle: admin\n";
        echo "✅ Corrections appliquées avec succès !\n";
        
    } else {
        echo "❌ Utilisateur non trouvé avec l'email abdoilniang00@gmail.com\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Erreur de base de données: " . $e->getMessage() . "\n";
}
?>
