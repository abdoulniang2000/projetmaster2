<?php

// Script simple pour créer un utilisateur sans dépendances Laravel

echo "=== Création d'utilisateur simple ===\n\n";

// Configuration de la base de données
$host = 'localhost';
$dbname = 'mastercampus'; // À adapter selon votre config
$username = 'root'; // À adapter selon votre config  
$password = ''; // À adapter selon votre config

try {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✓ Connexion à la base de données réussie\n\n";

    // Vérifier les tables
    echo "1. Vérification des tables:\n";
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $requiredTables = ['users', 'roles', 'role_user'];
    
    foreach ($requiredTables as $table) {
        if (in_array($table, $tables)) {
            echo "   ✓ Table '$table' existe\n";
        } else {
            echo "   ✗ Table '$table' manquante\n";
        }
    }
    echo "\n";

    // Vérifier les rôles
    echo "2. Rôles disponibles:\n";
    $roles = $pdo->query("SELECT * FROM roles")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($roles as $role) {
        echo "   - {$role['name']} ({$role['display_name']}) - Default: " . ($role['is_default'] ? 'Oui' : 'Non') . "\n";
    }
    echo "\n";

    // Créer l'utilisateur
    echo "3. Création d'un nouvel utilisateur:\n";
    
    $firstName = 'Test';
    $lastName = 'User';
    $username = 'test.user.' . time();
    $email = 'test' . time() . '@example.com';
    $passwordHash = password_hash('password123', PASSWORD_DEFAULT);
    
    // Insérer dans la table users
    $sql = "INSERT INTO users (first_name, last_name, username, email, password, status, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$firstName, $lastName, $username, $email, $passwordHash]);
    $userId = $pdo->lastInsertId();
    
    echo "   ✓ Utilisateur créé avec ID: $userId\n";
    echo "   ✓ Username: $username\n";
    echo "   ✓ Email: $email\n";
    echo "   ✓ Mot de passe: password123\n\n";

    // Attribuer un rôle
    echo "4. Attribution d'un rôle:\n";
    $defaultRole = $pdo->query("SELECT * FROM roles WHERE is_default = 1 LIMIT 1")->fetch(PDO::FETCH_ASSOC);
    
    if ($defaultRole) {
        $sql = "INSERT INTO role_user (user_id, role_id) VALUES (?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userId, $defaultRole['id']]);
        echo "   ✓ Rôle '{$defaultRole['name']}' attribué\n";
    } else {
        // Attribuer le premier rôle disponible
        $firstRole = $pdo->query("SELECT * FROM roles LIMIT 1")->fetch(PDO::FETCH_ASSOC);
        if ($firstRole) {
            $sql = "INSERT INTO role_user (user_id, role_id) VALUES (?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$userId, $firstRole['id']]);
            echo "   ✓ Rôle '{$firstRole['name']}' attribué (premier rôle disponible)\n";
        } else {
            echo "   ⚠ Aucun rôle trouvé - utilisateur créé sans rôle\n";
        }
    }

    echo "\n5. Vérification finale:\n";
    $user = $pdo->query("SELECT u.*, r.name as role_name 
                          FROM users u 
                          LEFT JOIN role_user ru ON u.id = ru.user_id 
                          LEFT JOIN roles r ON ru.role_id = r.id 
                          WHERE u.id = $userId")->fetch(PDO::FETCH_ASSOC);
    
    echo "   ✓ Utilisateur vérifié: {$user['username']}\n";
    echo "   ✓ Email: {$user['email']}\n";
    echo "   ✓ Rôle: " . ($user['role_name'] ?? 'Aucun') . "\n";
    echo "   ✓ Statut: " . ($user['status'] ? 'Actif' : 'Inactif') . "\n";

    echo "\n=== UTILISATEUR CRÉÉ AVEC SUCCÈS ===\n";
    echo "Vous pouvez maintenant vous connecter avec:\n";
    echo "Email: $email\n";
    echo "Mot de passe: password123\n";

} catch (PDOException $e) {
    echo "ERREUR DE BASE DE DONNÉES: " . $e->getMessage() . "\n";
    echo "Code: " . $e->getCode() . "\n";
} catch (Exception $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
}
