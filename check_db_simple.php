<?php
echo "Test simple PHP\n";
try {
    $pdo = new PDO('mysql:host=localhost;dbname=mastercampus', 'root', '');
    echo "DB OK\n";
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch();
    echo "Users count: " . $result['count'] . "\n";
    
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'role'");
    $role = $stmt->fetch();
    if ($role) {
        echo "Role column exists: " . $role['Type'] . "\n";
    } else {
        echo "Role column MISSING\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
