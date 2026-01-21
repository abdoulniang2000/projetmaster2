-- ==========================================
-- CORRECTION DU RÔLE POUR ABDOUL NIANG
-- ==========================================

-- 1. Mettre à jour la colonne role dans la table users
UPDATE users 
SET role = 'admin' 
WHERE email = 'abdoilniang00@gmail.com';

-- 2. Supprimer l'ancienne assignation de rôle étudiant si elle existe
DELETE FROM user_roles 
WHERE user_id = (SELECT id FROM users WHERE email = 'abdoilniang00@gmail.com');

-- 3. Assigner le rôle admin via la table user_roles
INSERT INTO user_roles (user_id, role_id, created_at, updated_at)
SELECT u.id, r.id, NOW(), NOW()
FROM users u, roles r
WHERE u.email = 'abdoilniang00@gmail.com' AND r.name = 'admin';

-- 4. Vérification
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.role as role_column,
    r.display_name as role_from_table,
    r.name as role_name
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'abdoilniang00@gmail.com';
