-- Création de la table conversations
CREATE TABLE `conversations` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `titre` varchar(255) NOT NULL,
    `description` text NULL,
    `type` enum('prive', 'groupe', 'matiere') NOT NULL,
    `cours_id` bigint(20) UNSIGNED NULL,
    `createur_id` bigint(20) UNSIGNED NOT NULL,
    `statut` enum('actif', 'archive', 'ferme') NOT NULL DEFAULT 'actif',
    `dernier_message_date` timestamp NULL DEFAULT NULL,
    `dernier_message_contenu` text NULL,
    `dernier_message_auteur` varchar(255) NULL,
    `nombre_messages` int(11) NOT NULL DEFAULT 0,
    `nombre_participants` int(11) NOT NULL DEFAULT 0,
    `visible` tinyint(1) NOT NULL DEFAULT 1,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `conversations_type_index` (`type`),
    KEY `conversations_statut_index` (`statut`),
    KEY `conversations_createur_id_index` (`createur_id`),
    KEY `conversations_cours_id_index` (`cours_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
