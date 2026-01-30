-- SQL pour créer la table semestres
-- Exécutez ces commandes directement dans phpMyAdmin ou votre client MySQL

-- Créer la table semestres (structure correspondant au modèle Laravel)
CREATE TABLE IF NOT EXISTS semestres (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT NULL,
    date_debut DATE NOT NULL DEFAULT (CURDATE()),
    date_fin DATE NOT NULL DEFAULT (DATE_ADD(CURDATE(), INTERVAL 6 MONTH)),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer quelques semestres par défaut
INSERT INTO semestres (nom, description, date_debut, date_fin, is_active, created_at, updated_at) VALUES
('Semestre 1', 'Premier semestre académique', '2025-09-01', '2026-01-31', TRUE, NOW(), NOW()),
('Semestre 2', 'Deuxième semestre académique', '2026-02-01', '2026-06-30', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Vérification
SELECT * FROM semestres;
