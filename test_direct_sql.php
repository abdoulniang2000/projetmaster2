<?php

echo "=== TEST DIRECT SQL ===\n\n";

try {
    // Connexion à la base
    $pdo = new PDO('mysql:host=localhost;dbname=mastercampus', 'root', '');
    echo "✅ Connexion réussie\n\n";
    
    // 1. Vérifier les colonnes de users
    echo "1. COLONNES DE USERS:\n";
    $stmt = $pdo->query("SHOW COLUMNS FROM users");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "   - {$row['Field']} : {$row['Type']}\n";
    }
    echo "\n";
    
    // 2. Vérifier si la colonne role existe
    echo "2. VÉRIFICATION COLONNE ROLE:\n";
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'role'");
    $roleColumn = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($roleColumn) {
        echo "   ✅ Colonne 'role' existe: {$roleColumn['Type']}\n";
    } else {
        echo "   ❌ Colonne 'role' n'existe pas\n";
    }
    echo "\n";
    
    // 3. Vérifier les rôles disponibles
    echo "3. RÔLES DISPONIBLES:\n";
    $stmt = $pdo->query("SELECT * FROM roles");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "   - {$row['name']} ({$row['display_name']})\n";
    }
    echo "\n";
    
    // 4. Test d'insertion avec role
    echo "4. TEST D'INSERTION:\n";
    $testEmail = 'test.' . time() . '@example.com';
    $testUsername = 'test.user.' . time();
    
    $sql = "INSERT INTO users (first_name, last_name, username, email, password, role, status, created_at, updated_at) 
            VALUES ('Test', 'User', '$testUsername', '$testEmail', '" . password_hash('password123', PASSWORD_DEFAULT) . "', 'etudiant', 1, NOW(), NOW())";
    
    try {
        $pdo->exec($sql);
        echo "   ✅ Insertion réussie\n";
        
        // Récupérer l'ID
        $userId = $pdo->lastInsertId();
        echo "   ID créé: $userId\n";
        
        // Vérifier l'utilisateur
        $stmt = $pdo->query("SELECT id, email, role FROM users WHERE id = $userId");
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "   Vérification: ID={$user['id']}, Email={$user['email']}, Role={$user['role']}\n";
        
        // Nettoyer
        $pdo->exec("DELETE FROM users WHERE id = $userId");
        echo "   ✅ Nettoyage effectué\n";
        
    } catch (PDOException $e) {
        echo "   ❌ Erreur insertion: " . $e->getMessage() . "\n";
        echo "   SQL: $sql\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Erreur connexion: " . $e->getMessage() . "\n";
}

echo "\n=== FIN ===\n";
