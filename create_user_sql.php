<?php

// Configuration de la base de données
$host = 'localhost';
$dbname = 'mastercampus';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "=== CRÉATION D'UTILISATEUR VIA SQL DIRECT ===\n\n";
    
    // 1. Vérifier la structure de la table users
    echo "1. Structure de la table users:\n";
    $columns = $pdo->query("DESCRIBE users")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $column) {
        echo "   - {$column['Field']} ({$column['Type']}) Null: " . ($column['Null'] == 'YES' ? 'Oui' : 'Non') . "\n";
    }
    echo "\n";
    
    // 2. Créer l'utilisateur avec les champs requis
    echo "2. Création de l'utilisateur:\n";
    
    $timestamp = time();
    $userData = [
        'first_name' => 'Test',
        'last_name' => 'User',
        'username' => 'test.user.' . $timestamp,
        'email' => 'test' . $timestamp . '@example.com',
        'password' => password_hash('password123', PASSWORD_DEFAULT),
        'status' => 1,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ];
    
    // Construire la requête SQL dynamiquement selon les colonnes disponibles
    $fields = [];
    $placeholders = [];
    $values = [];
    
    foreach ($userData as $field => $value) {
        // Vérifier si le champ existe dans la table
        $fieldExists = false;
        foreach ($columns as $column) {
            if ($column['Field'] === $field) {
                $fieldExists = true;
                break;
            }
        }
        
        if ($fieldExists) {
            $fields[] = $field;
            $placeholders[] = '?';
            $values[] = $value;
        }
    }
    
    $sql = "INSERT INTO users (" . implode(', ', $fields) . ") VALUES (" . implode(', ', $placeholders) . ")";
    
    echo "   Requête: $sql\n";
    echo "   Valeurs: " . json_encode($values, JSON_UNESCAPED_UNICODE) . "\n";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);
    $userId = $pdo->lastInsertId();
    
    echo "   ✓ Utilisateur créé avec ID: $userId\n\n";
    
    // 3. Vérifier l'utilisateur créé
    echo "3. Vérification de l'utilisateur:\n";
    $user = $pdo->query("SELECT * FROM users WHERE id = $userId")->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        echo "   ✓ Utilisateur trouvé\n";
        echo "   - ID: {$user['id']}\n";
        echo "   - Username: {$user['username']}\n";
        echo "   - Email: {$user['email']}\n";
        echo "   - Nom: {$user['first_name']} {$user['last_name']}\n";
        echo "   - Statut: " . ($user['status'] ? 'Actif' : 'Inactif') . "\n";
    } else {
        echo "   ✗ Utilisateur non trouvé\n";
    }
    echo "\n";
    
    // 4. Attribuer un rôle si la table role_user existe
    echo "4. Attribution d'un rôle:\n";
    $roleUserExists = false;
    foreach ($columns as $column) {
        if ($column['Field'] === 'role_id') {
            $roleUserExists = true;
            break;
        }
    }
    
    // Vérifier si la table role_user existe
    $roleUserTable = $pdo->query("SHOW TABLES LIKE 'role_user'")->fetchAll();
    if (!empty($roleUserTable)) {
        echo "   ✓ Table role_user trouvée\n";
        
        // Récupérer un rôle par défaut
        $defaultRole = $pdo->query("SELECT * FROM roles WHERE is_default = 1 LIMIT 1")->fetch(PDO::FETCH_ASSOC);
        
        if ($defaultRole) {
            $sql = "INSERT INTO role_user (user_id, role_id) VALUES (?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$userId, $defaultRole['id']]);
            echo "   ✓ Rôle '{$defaultRole['name']}' attribué\n";
        } else {
            // Prendre le premier rôle disponible
            $firstRole = $pdo->query("SELECT * FROM roles LIMIT 1")->fetch(PDO::FETCH_ASSOC);
            if ($firstRole) {
                $sql = "INSERT INTO role_user (user_id, role_id) VALUES (?, ?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$userId, $firstRole['id']]);
                echo "   ✓ Rôle '{$firstRole['name']}' attribué\n";
            } else {
                echo "   ⚠ Aucun rôle trouvé\n";
            }
        }
    } else {
        echo "   ⚠ Table role_user non trouvée\n";
    }
    
    echo "\n=== RÉSUMÉ ===\n";
    echo "Utilisateur créé avec succès!\n";
    echo "Email: {$userData['email']}\n";
    echo "Mot de passe: password123\n";
    echo "Username: {$userData['username']}\n";
    
} catch (PDOException $e) {
    echo "ERREUR SQL: " . $e->getMessage() . "\n";
    echo "Code: " . $e->getCode() . "\n";
} catch (Exception $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
}
