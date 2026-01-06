-- ==========================================
-- CRÉATION DES 3 UTILISATEURS AVEC RÔLES
-- Adapté selon la structure existante de la table users
-- ==========================================

-- ==========================================
-- CRÉATION DES UTILISATEURS
-- ==========================================

-- 1. Utilisateur ADMIN
INSERT INTO users (
    first_name, 
    last_name, 
    username, 
    email, 
    password, 
    status, 
    created_at, 
    updated_at
) VALUES (
    'Admin',
    'User',
    'admin',
    'admin@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
    1,
    NOW(),
    NOW()
);

-- 2. Utilisateur ENSEIGNANT
INSERT INTO users (
    first_name, 
    last_name, 
    username, 
    email, 
    password, 
    status, 
    created_at, 
    updated_at
) VALUES (
    'Professeur',
    'Alpha',
    'prof.alpha',
    'prof.alpha@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
    1,
    NOW(),
    NOW()
);

-- 3. Utilisateur ETUDIANT
INSERT INTO users (
    first_name, 
    last_name, 
    username, 
    email, 
    password, 
    status, 
    created_at, 
    updated_at
) VALUES (
    'Étudiant',
    'Un',
    'etudiant.un',
    'etudiant.un@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
    1,
    NOW(),
    NOW()
);

-- ==========================================
-- ASSIGNATION DES RÔLES AUX UTILISATEURS
-- ==========================================

-- Assigner le rôle admin à l'utilisateur admin@example.com
INSERT INTO role_user (user_id, role_id, created_at, updated_at)
SELECT u.id, r.id, NOW(), NOW()
FROM users u, roles r
WHERE u.email = 'admin@example.com' AND r.name = 'admin';

-- Assigner le rôle enseignant à l'utilisateur prof.alpha@example.com
INSERT INTO role_user (user_id, role_id, created_at, updated_at)
SELECT u.id, r.id, NOW(), NOW()
FROM users u, roles r
WHERE u.email = 'prof.alpha@example.com' AND r.name = 'enseignant';

-- Assigner le rôle étudiant à l'utilisateur etudiant.un@example.com
INSERT INTO role_user (user_id, role_id, created_at, updated_at)
SELECT u.id, r.id, NOW(), NOW()
FROM users u, roles r
WHERE u.email = 'etudiant.un@example.com' AND r.name = 'etudiant';

-- ==========================================
-- VÉRIFICATION
-- ==========================================

-- Vérifier les utilisateurs créés
SELECT 
    id,
    first_name,
    last_name,
    username,
    email,
    status,
    created_at
FROM users 
WHERE email IN ('admin@example.com', 'prof.alpha@example.com', 'etudiant.un@example.com')
ORDER BY id;

-- Vérifier les rôles assignés
SELECT 
    u.first_name,
    u.last_name,
    u.email,
    r.display_name as role,
    r.name as role_name
FROM users u
INNER JOIN role_user ru ON u.id = ru.user_id
INNER JOIN roles r ON ru.role_id = r.id
WHERE u.email IN ('admin@example.com', 'prof.alpha@example.com', 'etudiant.un@example.com')
ORDER BY u.id;

-- ==========================================
-- INFORMATIONS DE CONNEXION
-- ==========================================

/*
COMPTES CRÉÉS :

1. ADMINISTRATEUR
   Email: admin@example.com
   Mot de passe: password
   Rôle: Administrateur

2. ENSEIGNANT
   Email: prof.alpha@example.com
   Mot de passe: password
   Rôle: Enseignant

3. ETUDIANT
   Email: etudiant.un@example.com
   Mot de passe: password
   Rôle: Étudiant

NOTE: Le mot de passe pour tous les comptes est "password"
Le hash utilisé est: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
*/
