-- SQL pour modifier la structure de la table modules
-- Exécutez ces commandes directement dans phpMyAdmin ou votre client MySQL

-- 1. Ajouter le champ 'nom' après l'ID
ALTER TABLE modules ADD COLUMN nom VARCHAR(255) NOT NULL AFTER id;

-- 2. Mettre les anciens champs en nullable (optionnel, pour compatibilité)
ALTER TABLE modules MODIFY COLUMN cours_id BIGINT UNSIGNED NULL;
ALTER TABLE modules MODIFY COLUMN titre VARCHAR(255) NULL;
ALTER TABLE modules MODIFY COLUMN contenu TEXT NULL;
ALTER TABLE modules MODIFY COLUMN ordre INT NULL;

-- 3. Créer un cours par défaut si nécessaire
INSERT INTO cours (id, nom, description, enseignant_id, created_at, updated_at) 
VALUES (1, 'Cours par défaut', 'Cours créé pour les modules', 1, NOW(), NOW())
WHERE NOT EXISTS (SELECT 1 FROM cours WHERE id = 1);

-- 4. Mettre à jour les modules existants pour avoir un cours_id par défaut
UPDATE modules SET cours_id = 1 WHERE cours_id IS NULL;

-- 5. Remplir le champ 'nom' avec les valeurs de 'titre' pour les enregistrements existants
UPDATE modules SET nom = titre WHERE nom IS NULL OR nom = '';

-- Vérification
SELECT * FROM modules LIMIT 5;
