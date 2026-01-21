<?php

echo "=== CRÉATION DE LA TABLE ROLE_USER MANQUANTE ===\n\n";

// Configuration de la base de données
$host = 'localhost';
$dbname = 'mastercampus';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✓ Connexion à la base de données réussie\n\n";
    
    // Créer la table role_user
    echo "1. Création de la table role_user...\n";
    
    $sql = "CREATE TABLE IF NOT EXISTS `role_user` (
        `user_id` BIGINT UNSIGNED NOT NULL,
        `role_id` BIGINT UNSIGNED NOT NULL,
        `created_at` TIMESTAMP NULL DEFAULT NULL,
        `updated_at` TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (`user_id`, `role_id`),
        KEY `role_user_role_id_foreign` (`role_id`),
        CONSTRAINT `role_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
        CONSTRAINT `role_user_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($sql);
    echo "   ✓ Table role_user créée avec succès\n\n";
    
    // Vérifier la table
    echo "2. Vérification de la table créée...\n";
    $tables = $pdo->query("SHOW TABLES LIKE 'role_user'")->fetchAll();
    if (!empty($tables)) {
        echo "   ✓ Table role_user existe bien\n";
        
        // Afficher la structure
        $structure = $pdo->query("DESCRIBE role_user")->fetchAll(PDO::FETCH_ASSOC);
        echo "   Structure:\n";
        foreach ($structure as $column) {
            echo "     - {$column['Field']} ({$column['Type']})\n";
        }
    } else {
        echo "   ✗ Erreur lors de la création\n";
    }
    echo "\n";
    
    // Attribuer des rôles aux utilisateurs existants
    echo "3. Attribution des rôles aux utilisateurs existants...\n";
    
    $users = $pdo->query("SELECT id FROM users")->fetchAll(PDO::FETCH_COLUMN);
    $defaultRole = $pdo->query("SELECT id FROM roles WHERE is_default = 1 LIMIT 1")->fetchColumn();
    
    if (!$defaultRole) {
        $defaultRole = $pdo->query("SELECT id FROM roles LIMIT 1")->fetchColumn();
    }
    
    echo "   Utilisateurs trouvés: " . count($users) . "\n";
    echo "   Rôle par défaut: ID $defaultRole\n";
    
    foreach ($users as $userId) {
        // Vérifier si l'utilisateur a déjà un rôle
        $existing = $pdo->prepare("SELECT COUNT(*) FROM role_user WHERE user_id = ?");
        $existing->execute([$userId]);
        
        if ($existing->fetchColumn() == 0) {
            $stmt = $pdo->prepare("INSERT INTO role_user (user_id, role_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())");
            $stmt->execute([$userId, $defaultRole]);
            echo "   ✓ Rôle attribué à l'utilisateur ID $userId\n";
        } else {
            echo "   - L'utilisateur ID $userId a déjà un rôle\n";
        }
    }
    
    echo "\n4. Vérification finale...\n";
    $userRoles = $pdo->query("
        SELECT u.id, u.username, u.email, r.name as role_name, r.display_name 
        FROM users u 
        LEFT JOIN role_user ru ON u.id = ru.user_id 
        LEFT JOIN roles r ON ru.role_id = r.id 
        ORDER BY u.id
    ")->fetchAll(PDO::FETCH_ASSOC);
    
    echo "   Utilisateurs et leurs rôles:\n";
    foreach ($userRoles as $userRole) {
        echo "     - {$userRole['username']} ({$userRole['email']}) → " . ($userRole['role_name'] ?? 'Aucun rôle') . "\n";
    }
    
    echo "\n=== SUCCÈS COMPLET! ===\n";
    echo "La table role_user a été créée et les rôles ont été attribués.\n";
    echo "Vous pouvez maintenant créer des utilisateurs normalement.\n";
    
} catch (PDOException $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
    echo "Code: " . $e->getCode() . "\n";
}
