-- Version simplifiée sans contraintes de clés étrangères
CREATE TABLE `conversation_participants` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `conversation_id` bigint(20) UNSIGNED NOT NULL,
    `user_id` bigint(20) UNSIGNED NOT NULL,
    `role` varchar(50) NOT NULL DEFAULT 'membre',
    `date_adhesion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `derniere_lecture` timestamp NULL DEFAULT NULL,
    `nombre_messages_non_lus` int(11) NOT NULL DEFAULT 0,
    `active` tinyint(1) NOT NULL DEFAULT 1,
    `silencieux` tinyint(1) NOT NULL DEFAULT 0,
    `a_quitté` tinyint(1) NOT NULL DEFAULT 0,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `conversation_user_unique` (`conversation_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
