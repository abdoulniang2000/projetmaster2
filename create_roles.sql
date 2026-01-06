-- ==========================================
-- CRÉATION DES TABLES DE RÔLES ET PERMISSIONS
-- ==========================================

-- 1. Table des rôles
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NULL,
    description TEXT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- 2. Table des permissions
CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NULL,
    description TEXT NULL,
    group_name VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- 3. Table d'association rôle-utilisateur
CREATE TABLE IF NOT EXISTS role_user (
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 4. Table d'association permission-rôle
CREATE TABLE IF NOT EXISTS permission_role (
    permission_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (permission_id, role_id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ==========================================
-- INSERTION DES 3 RÔLES PRINCIPAUX
-- ==========================================

INSERT INTO roles (name, display_name, description, is_default, created_at, updated_at) VALUES
('admin', 'Administrateur', 'Accès complet au système', FALSE, NOW(), NOW()),
('enseignant', 'Enseignant', 'Gestion des cours et devoirs', FALSE, NOW(), NOW()),
('etudiant', 'Étudiant', 'Accès aux cours et devoirs', TRUE, NOW(), NOW());

-- ==========================================
-- INSERTION DES PERMISSIONS PRINCIPALES
-- ==========================================

INSERT INTO permissions (name, display_name, description, group_name, created_at, updated_at) VALUES
-- Utilisateurs
('view_users', 'Voir les utilisateurs', 'Voir la liste des utilisateurs', 'Utilisateurs', NOW(), NOW()),
('create_users', 'Créer des utilisateurs', 'Créer de nouveaux utilisateurs', 'Utilisateurs', NOW(), NOW()),
('edit_users', 'Modifier les utilisateurs', 'Modifier les informations des utilisateurs', 'Utilisateurs', NOW(), NOW()),
('delete_users', 'Supprimer des utilisateurs', 'Supprimer des utilisateurs', 'Utilisateurs', NOW(), NOW()),

-- Cours
('view_courses', 'Voir les cours', 'Voir la liste des cours', 'Cours', NOW(), NOW()),
('create_courses', 'Créer des cours', 'Créer de nouveaux cours', 'Cours', NOW(), NOW()),
('edit_courses', 'Modifier les cours', 'Modifier les informations des cours', 'Cours', NOW(), NOW()),
('delete_courses', 'Supprimer les cours', 'Supprimer des cours', 'Cours', NOW(), NOW()),

-- Devoirs
('view_assignments', 'Voir les devoirs', 'Voir la liste des devoirs', 'Devoirs', NOW(), NOW()),
('create_assignments', 'Créer des devoirs', 'Créer de nouveaux devoirs', 'Devoirs', NOW(), NOW()),
('edit_assignments', 'Modifier les devoirs', 'Modifier les informations des devoirs', 'Devoirs', NOW(), NOW()),
('delete_assignments', 'Supprimer les devoirs', 'Supprimer des devoirs', 'Devoirs', NOW(), NOW()),
('submit_assignments', 'Soumettre des devoirs', 'Soumettre des travaux', 'Devoirs', NOW(), NOW()),

-- Notes
('view_grades', 'Voir les notes', 'Voir les notes des étudiants', 'Notes', NOW(), NOW()),
('manage_grades', 'Gérer les notes', 'Noter les travaux et examens', 'Notes', NOW(), NOW()),

-- Messages
('send_messages', 'Envoyer des messages', 'Envoyer des messages aux utilisateurs', 'Messages', NOW(), NOW()),
('view_messages', 'Voir les messages', 'Voir les messages reçus', 'Messages', NOW(), NOW()),
('delete_messages', 'Supprimer les messages', 'Supprimer des messages', 'Messages', NOW(), NOW()),

-- Paramètres
('manage_settings', 'Gérer les paramètres', 'Gérer les paramètres du système', 'Paramètres', NOW(), NOW());

-- ==========================================
-- ASSIGNATION DES PERMISSIONS AUX RÔLES
-- ==========================================

-- Admin: Toutes les permissions
INSERT INTO permission_role (permission_id, role_id, created_at, updated_at)
SELECT p.id, r.id, NOW(), NOW()
FROM permissions p, roles r 
WHERE r.name = 'admin';

-- Enseignant: Permissions pédagogiques
INSERT INTO permission_role (permission_id, role_id, created_at, updated_at)
SELECT p.id, r.id, NOW(), NOW()
FROM permissions p, roles r 
WHERE r.name = 'enseignant' 
AND p.name IN (
    'view_courses', 'create_courses', 'edit_courses', 'delete_courses',
    'view_assignments', 'create_assignments', 'edit_assignments', 'delete_assignments',
    'view_grades', 'manage_grades',
    'send_messages', 'view_messages', 'delete_messages'
);

-- Étudiant: Permissions limitées
INSERT INTO permission_role (permission_id, role_id, created_at, updated_at)
SELECT p.id, r.id, NOW(), NOW()
FROM permissions p, roles r 
WHERE r.name = 'etudiant' 
AND p.name IN (
    'view_courses', 
    'view_assignments', 'submit_assignments',
    'view_grades',
    'send_messages', 'view_messages', 'delete_messages'
);

-- ==========================================
-- VÉRIFICATION
-- ==========================================

-- Vérifier les rôles créés
SELECT * FROM roles;

-- Vérifier les permissions par rôle
SELECT 
    r.display_name as role,
    COUNT(pr.permission_id) as nombre_permissions
FROM roles r
LEFT JOIN permission_role pr ON r.id = pr.role_id
GROUP BY r.id, r.display_name
ORDER BY r.id;
