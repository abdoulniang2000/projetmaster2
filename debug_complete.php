<?php

echo "=== DÉBOGAGE COMPLET DE LA CRÉATION UTILISATEUR ===\n\n";

// 1. Test de connexion à la base
try {
    $pdo = new PDO('mysql:host=localhost;dbname=mastercampus', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Connexion base réussie\n\n";
} catch (Exception $e) {
    echo "❌ Erreur connexion: " . $e->getMessage() . "\n";
    exit;
}

// 2. Vérifier la structure exacte de users
echo "2. STRUCTURE EXACTE DE USERS:\n";
$stmt = $pdo->query("DESCRIBE users");
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
$roleExists = false;
foreach ($columns as $col) {
    echo "   - {$col['Field']} ({$col['Type']}) " . ($col['Null'] == 'NO' ? 'NOT NULL' : 'NULL') . " Default: " . ($col['Default'] ?? 'NULL') . "\n";
    if ($col['Field'] == 'role') $roleExists = true;
}
echo "   Colonne role existe: " . ($roleExists ? "✅" : "❌") . "\n\n";

// 3. Vérifier les rôles exacts
echo "3. RÔLES EXACTS DANS LA BASE:\n";
$stmt = $pdo->query("SELECT * FROM roles");
$roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($roles as $role) {
    echo "   - ID: {$role['id']}, Name: '{$role['name']}', Display: '{$role['display_name']}'\n";
}
echo "\n";

// 4. Test d'insertion directe
echo "4. TEST D'INSERTION DIRECTE:\n";
try {
    $testEmail = 'test.' . time() . '@example.com';
    $testUsername = 'test.user.' . time();
    
    $sql = "INSERT INTO users (first_name, last_name, username, email, password, role, status, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
        'Test',
        'User', 
        $testUsername,
        $testEmail,
        password_hash('password123', PASSWORD_DEFAULT),
        'etudiant',
        1
    ]);
    
    if ($result) {
        $userId = $pdo->lastInsertId();
        echo "   ✅ Insertion réussie - ID: $userId\n";
        
        // Vérifier
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "   Vérification: Email={$user['email']}, Role={$user['role']}\n";
        
        // Nettoyer
        $pdo->exec("DELETE FROM users WHERE id = $userId");
        echo "   ✅ Nettoyage effectué\n";
    }
} catch (Exception $e) {
    echo "   ❌ Erreur insertion: " . $e->getMessage() . "\n";
    echo "   SQL: $sql\n";
}
echo "\n";

// 5. Vérifier les logs Laravel si disponibles
echo "5. LOGS LARAVEL:\n";
$logPath = __DIR__ . '/backend/storage/logs/laravel.log';
if (file_exists($logPath)) {
    $logs = file_get_contents($logPath);
    $recentLogs = substr($logs, -1000);
    echo "   Derniers logs:\n";
    echo "   " . str_replace("\n", "\n   ", trim($recentLogs)) . "\n";
} else {
    echo "   ❌ Fichier de logs non trouvé\n";
}

echo "\n=== FIN DU DÉBOGAGE ===\n";
