<?php

// Connexion simple sans Laravel
$host = '127.0.0.1';
$dbname = 'mastercampus';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    
    echo "=== CORRECTION SIMPLE ===\n";
    
    // Hash pour le mot de passe "passer"
    $hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    
    // Mettre à jour le mot de passe et le rôle
    $stmt = $pdo->prepare("UPDATE users SET password = ?, role = ? WHERE email = ?");
    $stmt->execute([$hash, 'admin', 'abdoilniang00@gmail.com']);
    
    echo "✅ Mot de passe et rôle mis à jour\n";
    
    // Supprimer et recréer user_roles
    $stmt = $pdo->prepare("DELETE FROM user_roles WHERE user_id = (SELECT id FROM users WHERE email = ?)");
    $stmt->execute(['abdoilniang00@gmail.com']);
    
    $stmt = $pdo->prepare("INSERT INTO user_roles (user_id, role_id, created_at, updated_at) SELECT u.id, r.id, NOW(), NOW() FROM users u, roles r WHERE u.email = ? AND r.name = ?");
    $stmt->execute(['abdoilniang00@gmail.com', 'admin']);
    
    echo "✅ Rôle admin assigné\n";
    
    // Vérification
    $stmt = $pdo->prepare("SELECT id, first_name, last_name, email, role FROM users WHERE email = ?");
    $stmt->execute(['abdoilniang00@gmail.com']);
    $user = $stmt->fetch();
    
    echo "\nUtilisateur mis à jour:\n";
    echo "- ID: {$user['id']}\n";
    echo "- Nom: {$user['first_name']} {$user['last_name']}\n";
    echo "- Email: {$user['email']}\n";
    echo "- Rôle: {$user['role']}\n";
    
    echo "\n✅ Terminé ! Connectez-vous avec:\n";
    echo "📧 Email: abdoilniang00@gmail.com\n";
    echo "🔑 Mot de passe: passer\n";
    
} catch (PDOException $e) {
    echo "❌ Erreur: " . $e->getMessage();
}
?>
