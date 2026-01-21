<?php

echo "=== TEST DE CONNEXION À LA BASE DE DONNÉES ===\n\n";

// Test avec différentes configurations
$configs = [
    ['host' => 'localhost', 'dbname' => 'mastercampus', 'user' => 'root', 'pass' => ''],
    ['host' => '127.0.0.1', 'dbname' => 'mastercampus', 'user' => 'root', 'pass' => ''],
    ['host' => 'localhost', 'dbname' => 'mastercampus', 'user' => 'root', 'pass' => 'root'],
    ['host' => '127.0.0.1', 'dbname' => 'mastercampus', 'user' => 'root', 'pass' => 'root'],
];

foreach ($configs as $i => $config) {
    echo "Test " . ($i + 1) . ": {$config['user']}@{$config['host']}/{$config['dbname']}\n";
    
    try {
        $pdo = new PDO("mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4", 
                      $config['user'], $config['pass']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        echo "   ✓ Connexion réussie!\n";
        
        // Lister les tables
        $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        echo "   Tables trouvées (" . count($tables) . "): " . implode(', ', array_slice($tables, 0, 5)) . "...\n";
        
        // Vérifier les tables importantes
        $importantTables = ['users', 'roles', 'role_user'];
        foreach ($importantTables as $table) {
            if (in_array($table, $tables)) {
                $count = $pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
                echo "   ✓ Table '$table': $count enregistrements\n";
            } else {
                echo "   ✗ Table '$table': manquante\n";
            }
        }
        
        echo "\n=== CRÉATION D'UN UTILISATEUR DE TEST ===\n";
        
        // Créer un utilisateur
        $timestamp = time();
        $username = 'test.user.' . $timestamp;
        $email = 'test' . $timestamp . '@example.com';
        $passwordHash = password_hash('password123', PASSWORD_DEFAULT);
        
        $sql = "INSERT INTO users (first_name, last_name, username, email, password, status, created_at, updated_at) 
                VALUES ('Test', 'User', ?, ?, ?, 1, NOW(), NOW())";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$username, $email, $passwordHash]);
        $userId = $pdo->lastInsertId();
        
        echo "   ✓ Utilisateur créé: ID $userId\n";
        echo "   ✓ Username: $username\n";
        echo "   ✓ Email: $email\n";
        echo "   ✓ Mot de passe: password123\n";
        
        // Attribuer un rôle
        $roleUserTable = $pdo->query("SHOW TABLES LIKE 'role_user'")->fetchAll();
        if (!empty($roleUserTable)) {
            $defaultRole = $pdo->query("SELECT * FROM roles WHERE is_default = 1 LIMIT 1")->fetch(PDO::FETCH_ASSOC);
            if ($defaultRole) {
                $pdo->query("INSERT INTO role_user (user_id, role_id) VALUES ($userId, {$defaultRole['id']})");
                echo "   ✓ Rôle '{$defaultRole['name']}' attribué\n";
            }
        }
        
        echo "\n=== SUCCÈS! ===\n";
        echo "Vous pouvez vous connecter avec:\n";
        echo "Email: $email\n";
        echo "Mot de passe: password123\n";
        
        break; // Sortir après le premier succès
        
    } catch (PDOException $e) {
        echo "   ✗ Erreur: " . $e->getMessage() . "\n\n";
    }
}

if (!isset($pdo)) {
    echo "Aucune configuration n'a fonctionné. Vérifiez:\n";
    echo "1. Que votre serveur MySQL est démarré\n";
    echo "2. Que la base de données 'mastercampus' existe\n";
    echo "3. Vos identifiants MySQL (utilisateur/mot de passe)\n";
    echo "4. Que PHP peut se connecter à MySQL\n";
}
