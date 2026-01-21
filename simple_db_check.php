<?php

echo "=== VÉRIFICATION SIMPLE DE LA BASE DE DONNÉES ===\n\n";

// Connexion directe à la base
try {
    $pdo = new PDO('mysql:host=localhost;dbname=mastercampus', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Connexion à la base réussie\n\n";
    
    // 1. Vérifier les tables
    echo "1. TABLES DISPONIBLES:\n";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        echo "   - $table\n";
    }
    echo "\n";
    
    // 2. Structure de la table users
    echo "2. STRUCTURE DE LA TABLE USERS:\n";
    $stmt = $pdo->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $column) {
        echo "   - {$column['Field']} ({$column['Type']}) " . ($column['Null'] == 'NO' ? 'NOT NULL' : 'NULL') . "\n";
    }
    echo "\n";
    
    // 3. Structure de la table roles
    echo "3. STRUCTURE DE LA TABLE ROLES:\n";
    $stmt = $pdo->query("DESCRIBE roles");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $column) {
        echo "   - {$column['Field']} ({$column['Type']}) " . ($column['Null'] == 'NO' ? 'NOT NULL' : 'NULL') . "\n";
    }
    echo "\n";
    
    // 4. Vérifier si user_roles existe
    echo "4. VÉRIFICATION DE LA TABLE USER_ROLES:\n";
    try {
        $stmt = $pdo->query("DESCRIBE user_roles");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "   ✅ Table user_roles existe\n";
        foreach ($columns as $column) {
            echo "   - {$column['Field']} ({$column['Type']})\n";
        }
    } catch (Exception $e) {
        echo "   ❌ Table user_roles n'existe pas: " . $e->getMessage() . "\n";
    }
    echo "\n";
    
    // 5. Données dans roles
    echo "5. DONNÉES DANS ROLES:\n";
    $stmt = $pdo->query("SELECT * FROM roles");
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($roles as $role) {
        echo "   ID: {$role['id']}, Name: '{$role['name']}', Display: '{$role['display_name']}'\n";
    }
    echo "\n";
    
    // 6. Test d'insertion simple
    echo "6. TEST D'INSERTION DANS USERS:\n";
    try {
        $sql = "INSERT INTO users (first_name, last_name, username, email, password, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            'Test',
            'User',
            'test.user.' . time(),
            'test.' . time() . '@example.com',
            password_hash('password123', PASSWORD_DEFAULT),
            'etudiant',
            1
        ]);
        
        if ($result) {
            $userId = $pdo->lastInsertId();
            echo "   ✅ Utilisateur inséré avec ID: $userId\n";
            
            // Supprimer le test
            $pdo->exec("DELETE FROM users WHERE id = $userId");
            echo "   ✅ Utilisateur de test supprimé\n";
        }
    } catch (Exception $e) {
        echo "   ❌ Erreur lors de l'insertion: " . $e->getMessage() . "\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Erreur de connexion: " . $e->getMessage() . "\n";
}

echo "\n=== FIN ===\n";
