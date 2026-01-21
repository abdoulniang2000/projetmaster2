-- ==========================================
-- CORRECTION FINALE (SQL CORRIGÉ)
-- ==========================================

-- 1. Mettre à jour le mot de passe avec des backticks
UPDATE users 
SET `password` = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'abdoilniang00@gmail.com';

-- 2. Mettre à jour le rôle
UPDATE users 
SET `role` = 'admin'
WHERE email = 'abdoilniang00@gmail.com';

-- 3. Supprimer les anciennes assignations de rôle
DELETE FROM user_roles 
WHERE user_id = (SELECT id FROM users WHERE email = 'abdoilniang00@gmail.com');

-- 4. Assigner le rôle admin
INSERT INTO user_roles (user_id, role_id, created_at, updated_at)
SELECT u.id, r.id, NOW(), NOW()
FROM users u, roles r
WHERE u.email = 'abdoilniang00@gmail.com' AND r.name = 'admin';

-- 5. Vérification
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.`role` as role_column,
    r.display_name as role_from_table
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'abdoilniang00@gmail.com';
