-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 01, 2026 at 01:54 PM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mastercampus`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` enum('prive','groupe','matiere') COLLATE utf8mb4_unicode_ci NOT NULL,
  `cours_id` bigint UNSIGNED DEFAULT NULL,
  `createur_id` bigint UNSIGNED NOT NULL,
  `statut` enum('actif','archive','ferme') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actif',
  `dernier_message_date` timestamp NULL DEFAULT NULL,
  `dernier_message_contenu` text COLLATE utf8mb4_unicode_ci,
  `dernier_message_auteur` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_messages` int NOT NULL DEFAULT '0',
  `nombre_participants` int NOT NULL DEFAULT '0',
  `visible` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `conversations_type_index` (`type`),
  KEY `conversations_statut_index` (`statut`),
  KEY `conversations_createur_id_index` (`createur_id`),
  KEY `conversations_cours_id_index` (`cours_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversation_participants`
--

DROP TABLE IF EXISTS `conversation_participants`;
CREATE TABLE IF NOT EXISTS `conversation_participants` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'membre',
  `date_adhesion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `derniere_lecture` timestamp NULL DEFAULT NULL,
  `nombre_messages_non_lus` int NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `silencieux` tinyint(1) NOT NULL DEFAULT '0',
  `a_quitté` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `conversation_user_unique` (`conversation_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cours`
--

DROP TABLE IF EXISTS `cours`;
CREATE TABLE IF NOT EXISTS `cours` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `enseignant_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cours_enseignant_id_foreign` (`enseignant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cours`
--

INSERT INTO `cours` (`id`, `nom`, `description`, `enseignant_id`, `created_at`, `updated_at`) VALUES
(1, 'Cours par défaut', 'Cours créé pour les modules', 1, '2026-01-27 20:07:15', '2026-01-27 20:07:15');

-- --------------------------------------------------------

--
-- Table structure for table `departements`
--

DROP TABLE IF EXISTS `departements`;
CREATE TABLE IF NOT EXISTS `departements` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chef_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departements_code_unique` (`code`),
  KEY `departements_chef_id_foreign` (`chef_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `devoirs`
--

DROP TABLE IF EXISTS `devoirs`;
CREATE TABLE IF NOT EXISTS `devoirs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `cours_id` bigint UNSIGNED NOT NULL,
  `titre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_limite` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fichier_joint` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `devoirs_cours_id_foreign` (`cours_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `matieres`
--

DROP TABLE IF EXISTS `matieres`;
CREATE TABLE IF NOT EXISTS `matieres` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `module_id` int DEFAULT NULL,
  `semestre_id` int DEFAULT NULL,
  `departement_id` int DEFAULT NULL,
  `credits` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matieres_code_unique` (`code`),
  KEY `matieres_departement_id_foreign` (`departement_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `matieres`
--

INSERT INTO `matieres` (`id`, `nom`, `code`, `description`, `module_id`, `semestre_id`, `departement_id`, `credits`, `created_at`, `updated_at`) VALUES
(1, 'projet operationnel', 'INFO100', 'developpement web', 2, 3, NULL, 10, '2026-01-31 00:31:43', '2026-01-31 00:31:43');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `expediteur_id` bigint UNSIGNED NOT NULL,
  `destinataire_id` bigint UNSIGNED NOT NULL,
  `contenu` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `lu_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_expediteur_id_foreign` (`expediteur_id`),
  KEY `messages_destinataire_id_foreign` (`destinataire_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_01_01_000000_create_roles_table', 1),
(5, '2025_01_01_000001_create_permissions_table', 1),
(6, '2025_01_01_000002_create_user_roles_table', 1),
(7, '2025_01_01_000003_create_role_permissions_table', 1),
(8, '2025_01_01_000004_add_fields_to_users_table', 1),
(9, '2025_12_19_101500_create_profils_table', 1),
(10, '2025_12_19_101600_create_cours_table', 1),
(11, '2025_12_19_101700_create_modules_table', 1),
(12, '2025_12_19_101800_create_devoirs_table', 1),
(13, '2025_12_19_101900_create_soumissions_table', 1),
(14, '2025_12_19_102000_create_notes_table', 1),
(15, '2025_12_19_102100_create_messages_table', 1),
(16, '2025_12_19_102200_create_notifications_table', 1),
(17, '2025_12_19_102300_add_role_to_users_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
CREATE TABLE IF NOT EXISTS `modules` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cours_id` bigint UNSIGNED DEFAULT NULL,
  `titre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contenu` text COLLATE utf8mb4_unicode_ci,
  `ordre` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `modules_cours_id_foreign` (`cours_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `nom`, `cours_id`, `titre`, `contenu`, `ordre`, `created_at`, `updated_at`) VALUES
(2, 'informatique', 1, 'informatique', 'Module créé', 1, '2026-01-27 20:13:17', '2026-01-27 20:13:17'),
(3, 'maintenace', 1, 'maintenace', 'Module créé', 1, '2026-01-27 21:14:57', '2026-01-27 21:14:57');

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
CREATE TABLE IF NOT EXISTS `notes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `soumission_id` bigint UNSIGNED NOT NULL,
  `evaluateur_id` bigint UNSIGNED NOT NULL,
  `note` decimal(5,2) NOT NULL,
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notes_soumission_id_foreign` (`soumission_id`),
  KEY `notes_evaluateur_id_foreign` (`evaluateur_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint UNSIGNED NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `group` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `display_name`, `description`, `group`, `created_at`, `updated_at`) VALUES
(1, 'view_users', 'Voir les utilisateurs', 'Voir la liste des utilisateurs', 'Utilisateurs', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(2, 'create_users', 'Créer des utilisateurs', 'Créer de nouveaux utilisateurs', 'Utilisateurs', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(3, 'edit_users', 'Modifier les utilisateurs', 'Modifier les informations des utilisateurs', 'Utilisateurs', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(4, 'delete_users', 'Supprimer des utilisateurs', 'Supprimer des utilisateurs', 'Utilisateurs', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(5, 'view_courses', 'Voir les cours', 'Voir la liste des cours', 'Cours', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(6, 'create_courses', 'Créer des cours', 'Créer de nouveaux cours', 'Cours', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(7, 'edit_courses', 'Modifier les cours', 'Modifier les informations des cours', 'Cours', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(8, 'delete_courses', 'Supprimer les cours', 'Supprimer des cours', 'Cours', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(9, 'view_assignments', 'Voir les devoirs', 'Voir la liste des devoirs', 'Devoirs', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(10, 'create_assignments', 'Créer des devoirs', 'Créer de nouveaux devoirs', 'Devoirs', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(11, 'edit_assignments', 'Modifier les devoirs', 'Modifier les informations des devoirs', 'Devoirs', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(12, 'delete_assignments', 'Supprimer les devoirs', 'Supprimer des devoirs', 'Devoirs', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(13, 'submit_assignments', 'Soumettre des devoirs', 'Soumettre des travaux', 'Devoirs', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(14, 'view_grades', 'Voir les notes', 'Voir les notes des étudiants', 'Notes', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(15, 'manage_grades', 'Gérer les notes', 'Noter les travaux et examens', 'Notes', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(16, 'send_messages', 'Envoyer des messages', 'Envoyer des messages aux utilisateurs', 'Messages', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(17, 'view_messages', 'Voir les messages', 'Voir les messages reçus', 'Messages', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(18, 'delete_messages', 'Supprimer les messages', 'Supprimer des messages', 'Messages', '2026-01-05 16:18:30', '2026-01-05 16:18:30'),
(19, 'manage_settings', 'Gérer les paramètres', 'Gérer les paramètres du système', 'Paramètres', '2026-01-05 16:18:30', '2026-01-05 16:18:30');

-- --------------------------------------------------------

--
-- Table structure for table `profils`
--

DROP TABLE IF EXISTS `profils`;
CREATE TABLE IF NOT EXISTS `profils` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_profil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `profils_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `display_name`, `description`, `is_default`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'admin', 'Administrateur', 'Accès complet au système', 0, '2026-01-05 16:10:30', '2026-01-05 16:10:30', NULL),
(2, 'enseignant', 'Enseignant', 'Gestion des cours et devoirs', 0, '2026-01-05 16:10:30', '2026-01-05 16:10:30', NULL),
(3, 'etudiant', 'Étudiant', 'Accès aux cours et devoirs', 1, '2026-01-05 16:10:30', '2026-01-05 16:10:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` bigint UNSIGNED NOT NULL,
  `permission_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permissions_role_id_permission_id_unique` (`role_id`,`permission_id`),
  KEY `role_permissions_permission_id_foreign` (`permission_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
(1, 1, 10, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(2, 1, 6, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(3, 1, 2, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(4, 1, 12, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(5, 1, 8, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(6, 1, 18, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(7, 1, 4, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(8, 1, 11, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(9, 1, 7, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(10, 1, 3, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(11, 1, 15, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(12, 1, 19, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(13, 1, 16, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(14, 1, 13, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(15, 1, 9, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(16, 1, 5, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(17, 1, 14, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(18, 1, 17, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(19, 1, 1, '2026-01-05 16:19:14', '2026-01-05 16:19:14'),
(32, 2, 10, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(33, 2, 6, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(34, 2, 12, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(35, 2, 8, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(36, 2, 18, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(37, 2, 11, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(38, 2, 7, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(39, 2, 15, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(40, 2, 16, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(41, 2, 9, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(42, 2, 5, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(43, 2, 14, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(44, 2, 17, '2026-01-05 16:19:40', '2026-01-05 16:19:40'),
(47, 3, 18, '2026-01-05 16:20:02', '2026-01-05 16:20:02'),
(48, 3, 16, '2026-01-05 16:20:02', '2026-01-05 16:20:02'),
(49, 3, 13, '2026-01-05 16:20:02', '2026-01-05 16:20:02'),
(50, 3, 9, '2026-01-05 16:20:02', '2026-01-05 16:20:02'),
(51, 3, 5, '2026-01-05 16:20:02', '2026-01-05 16:20:02'),
(52, 3, 14, '2026-01-05 16:20:02', '2026-01-05 16:20:02'),
(53, 3, 17, '2026-01-05 16:20:02', '2026-01-05 16:20:02');

-- --------------------------------------------------------

--
-- Table structure for table `semestres`
--

DROP TABLE IF EXISTS `semestres`;
CREATE TABLE IF NOT EXISTS `semestres` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `annee_academique` varchar(255) COLLATE utf8mb4_general_ci DEFAULT '2025-2026',
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `semestres`
--

INSERT INTO `semestres` (`id`, `nom`, `annee_academique`, `date_debut`, `date_fin`, `is_active`, `created_at`, `updated_at`) VALUES
(3, 'semestre1', '2025-2026', '2026-01-01', '2026-12-31', 1, '2026-01-27 21:31:46', '2026-01-27 21:31:46'),
(4, 'semestre2', '2025-2026', '2026-01-29', '2026-07-29', 1, '2026-01-29 23:41:32', '2026-01-29 23:41:32'),
(5, 'semestre3', '2025-2026', '2026-01-29', '2026-06-30', 1, '2026-01-29 23:46:05', '2026-01-29 23:46:05');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0C7t97Jf5xa5iy0EaZKLs0imBKaSPF3Lc7UpoJDH', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieHF3VUhheWttRkZ3eWhRdDFQdE5Ob1ZESTFPeUdVOE9iNTJmaDdDeiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769950181),
('23psZTZhNnpmzRxXxSqU7zkrDjZYYDJzyjo5qTBZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNmJuTTZ6UExybGh2MWQ1cnppVXFyMzhZVEZSZ3k3bWVPN1FWQ2VwMyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951857),
('2MRkxKCoLPZBrOr7TuP02gw3FXO9OgpnR2ddmExy', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieWZwUWNXZHJrMFVQN1EzQTFGUDZlMDVTR3ZDWm8xeU9GS1lMTGltTSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951806),
('2r4ULjRdzDHc3GXI1cLAUd0Y7imiUiXECJpZFn54', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYXdIYjFCb1gwWmFVcEw2NGpRZ2ppSDlMRkQyNDBMVlp4dU5zYVRqOSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951800),
('2xh4lJsser3UQSNmakFEwtUF6Hm6ruBxH5ggG6jN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaFhsUGlLUWNDZHNjcWNkbDdrcE5nNER6UFN1c01tTHA5NlBGbEg3TSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952259),
('3GFlPirPjFOm04FvDcUGCoaetZfj5kiBzCHxRelX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidGVTMDlwTkE2d04za056Q0pVTnlIOXlVRU1USDF6NkFxbnpxaExFdiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949251),
('3P5lZyQk19RFob8Y0ddGacdInF8fv6qRGHhkbNnE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWDg0eHRaaGw4MzdzYm1oeTNVUm84UmZCZzRibERjT2huVkdmYWdsbiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951802),
('3x0UUSQquSD7XE126U8Uw0CfvWLxVRer5acjtdXF', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTzdNSDdjYVowT3NxbWg1clQ1QTRRZnNYQmlFbkdNVE5ZRzJHR0ZJUSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952010),
('3ZGrt78R2PsoNM2wcnaYEEZVAKiZobNmO6URNRB2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYm9XbW1pMm5qNnZFZjFrdWtFbmhGVUJ1MUdNbGJnYmdGaUQxRUtiTiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951857),
('5fNjX30RZdmtF8upk11ZRQJ2yOUDBQwOOgSYB33m', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiM3cxVmVEekNFTERVUVpRUU1yd1dZRzR1YktHc2tDeXVlbXNTNW05NyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949470),
('5HoQDBRujSbnHvzQJBxGftX7j859bVMrJlgaMCnX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVjcyR2dQbGxkT0xCVUI0SUQ0MmdqZ1NmQk9sNjJnTlV5cmpiWlhDZyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952305),
('5T8Xoqp6DfbXRNdBVSdaJPKOj4qsR3haAqQO9F8T', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaWVaREp4cVk4VURpR0ZRWENteGtHNEVMZFNubHdYSVZ4czRINkhqMSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952064),
('5wPYfZdcI8hmnA9OHz4OXSTtTOdwj3Y6C35T6H8V', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZDZTR3JiWEV3c0FxOWlhcmg0M2E4NXV6SlFhN1Zkc2JKaWJjWHN5YyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952068),
('5YBWtYHrPuSQOtdPfee6GNh7mgDZZDatfRA9gD6j', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOVE5OTE4QXlzMU9QazFEWEowM0s4cXMwY3FvM0phNVFzTkU1RU5XWSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952119),
('6FCMrwBWpuaFwsoQSMKs68hZh8doqzrZtP0DZ30E', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZndOakZkMWZUQnUwVmU4RmhqWUhPdWEzeFdCMkF4ZUg3bVpFcUFUciI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952070),
('6hsMcBcWJXH72jss0yf9ODdjRmmHuYJkcrlZmcqq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieWVBRVdHbkUxRVBNbWUwMnNGdU83YUxUQlRwc1RFQUhIaDVHN1RHaCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952067),
('6qphuEWhroLbEbOXf67QXOZ7aoCaOsf8y28qxNjU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYkd6NVc5VVhaN1R3d1E5aUg0a1B6UkNuRkJ5T3BIUUpVVUt0NXRvZCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949266),
('8Hk6aWkJJGEdWsUytS74bhGM0W5EBZ0AtyqsM2ma', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNzZ1N1hTQ0ZaU3pOUzdOWGROMk1CMDA1QWFYaEJPd0ZDRjRxR3kyQyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949252),
('95UdB4AIkRxrdpv2chG1LWH92evvJVi0WC9YPwMo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQlpnd2l1cjI2YWFGbU5CbzE0Z0RsVmxJaVN3QWtSek5OTTdYN1p3byI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951827),
('9d96KQm8ViC7J7tGuZirqk9nlVcVB6uYH9PYOW78', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWWptN3dPYnM0U2FQM2hNdUJtaU1GMlkwc25oMDJNanRnbm80bHZOSyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769950179),
('A8bz0MWRFGzzbyekRPfqYzO89RoY4IepHfCDXMXw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTVd6emFDVFViVEs3ZDFNakloUlZxUjVYM0lTYmZqUlNhSUdab0tqOSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949281),
('aH0LfcuKYXYbpiwqMAwNzEkUMC8AoqOKB43C2vdL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibE9ybkRqVUxEbUdrSXFnMGIwY2RnY2dJcUd0V2VZVnhRRzJUNjdaRSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951802),
('BojcqVTOAlat74PoOBDtnGCSMGfN3ycLbRRH9676', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiMGRIQzh0THhEYlhMYVBDdm04eFJVZFZONWR6c1BjVkdqZ3VneGxGeiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949251),
('BtEyGT084QrC6c5n2PrbruP5MwyEAsyWxU7Sot8w', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoid2hkSzNHWWRTbFdoV1ZtWUFYRkRnYXdYVFBPT2VDV0RJNUZpSXU4cCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952260),
('cl2IXVgzZX88TBTusrXiqjQ2hZMbYSL5rUO3xAkY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZHNWaWp6THZ5cktnYzZmVDB5aDFnY1d5Q0VNVTRKQml2dldUaVQxWiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951621),
('CyYUqSktue2Im6FDZpHGGG78RVR54DruDDypaGun', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicFk0NEpqZDREdVd2T3dGSXVwTTBrV0ZSMHVWbXZydWJBU0Y5UGtVUCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951767),
('Dn28tZ5xRgXbqszfyVkJ0krF3rFbO3egPbn5clvP', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSjk2Y1JPR1p4SE53N2ZEc1JEQUwyZVJxSnVwY3lVMzYxOEZoU3ROVCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951826),
('dq9uIhautsPSQ0MW86e7rrbF1xifqRDSS0G7JJ14', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSEl1YlVsOHVDaXFNOFdRam1FRGttcjRxT3R5dm9PY3lyZnJnTUlYciI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949253),
('dqzylHes8Y3zh1d44rrb9yAXQnWj5SPOGpRKbOLn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiR1BudnVUanhmUTd2aFJwU29GVHdwWHJoUkhEd2M0SllzbldGMUdOZiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949281),
('Du2mTMATjAvcJrG5vYizHarPSplCHiPAvpG41dGP', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSXJQTW41bXZJcVNkblh4c2JlME1vWE00NTVodGZWaVdVR0Q0NG1iYiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952119),
('E5Eq20NqOniX6p1UXBGH2Yaj2oYwxWx4SzT1kxFq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZnR5b041RzMxemE4aWNhYXpaNU1ZVU9TblpsUDlJclVzY05ud281TSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951826),
('ePU2katYKy1P02f3h8Y0jjK7r2tiYLATfNCVLMtw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNUo3dFNzZXZIMHl1d3pVRk8xb1dkR0Zib0wzMFhDU2hCRFRwQ1FCUiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952118),
('eTN5abNiIfQ4URGxypbEkiIqS4UcBYWNsTXG4FeY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoienNsNFI3SFcyaklCNnlXblFsZDFIeVhyUUt4VEtTN3JkQXZkRFRZUiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951808),
('f18T851dk4DjqD5Km3QTj1lsYQi4Kgex6JXb89o2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNDlINFVnOFdrZ01Qd3RMZXozeFk2NERYWGNuOFA5azlkYUx2UTdERiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951276),
('FQMe5rYHNSSvIDZagx2CctVOfqVBe5alxy4sfETl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQW5xZHVIWEQ3ZVRHbXhkU2tJZEJGbEs1WHo2S0ZhaXNhN2wyS251NiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951550),
('Fy6Lm57DTeE7bbLDiaC9BIR2fByGTgrIBRq1Xqvq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVERLQlNnTGl0c2Nid1BFbTZFcElXTFNKNGpWUnVpMENlUGtQd1BNNSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949266),
('fz3IejSWXKfU8ISgWd7FFCv4j451BYnew1xEqpEU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYjA5SDNXcE5lb1N6akhobTZTbUFXNEtJOU9yTWNXN2dVTmVjYU9aayI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951767),
('gGeCBaoglKnXO4UNJLJOu7RI7FPSuliFXep157dG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieWR3UDBtaFRiZ2g2Q3R2bXE0aG1KSGVIc2RTUUFZd1hXZUZ0N1ZEUSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949264),
('gIBkLyG33N7ID7GS4tcTzEjyx9y8Vr8a2wwzgtCu', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiMlJieXFnWEZ6bGtpMmw0QlFYR2pqSkJSVXpQZUN5THI1RnY4c1RmYyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951550),
('GOTOlMfzS51VsAFJwW7M3ECysDmDMh0bwFFnOx4I', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTGhLbEM3TE9TbUFWOUhyalpJT3M4RkZ5WkVpeWhhYVZ1WDF0YUJBZyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952272),
('gUN9fpmNQGmoRxyjH3DHdVR3rlZ4iEFcgJnr3wRW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTWRiVkxSRVdpcjNheGQyelZmOWV5eUVSSXVYS3dlaGRJSVJWRk8yWSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951856),
('guZCALzuQo5xPEML9MCsoW8hIlGNFPf9dkIvajeZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRDZmNTU0WWlKdUlwNWljN3IySWlsZ09jZ01SWTlkV0prMDNQcFBQVCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949277),
('hDmyApWNQZQChpvPC7HyJhrWkoireHG6OsSMou3S', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQ0VJbWJPMktIVkRqNXNKcFRVU09FeklSc2w0a2o2Z2t6TUNqWENzWCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951798),
('HdRoRnp8fsnasYZrH0BtUmR0eNeof8wZXDXqkgNw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiS2Jicm80SXpQSVlEUWRMSnRvRFRWQlhBZThiRnJEMTQ5WHIyRlF6SyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949246),
('hfl6yRALpNSxLDlR4fQD9lqqR8DKVvlNxc6JpZNO', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRnBRQkZ6QnczNTBOb2hCMHJiTllFaEtMcE82YlhXU1YxU1RDMUlZSCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951768),
('HioKlQHeMrZIP9YjfAoVOda0rsPGLqltL5iWXwXo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUERzOGdkMzVGN2NOOWp6cWJQdU9BTmp5R0QwSFQ0dGtmdkNGZXNGeCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949882),
('hMaACaUFbx9sgUWrXr5BNy82Bq91B8cqvP8qIbpI', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiT0NIV3l6VVVoNVZ3Y1BiYUI3N3ZsaDlPdmhmMGtVbGZmS3B1MVJyTCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951828),
('HMF1WGI9ApYSnl20jKSEFhWnMi7fxXhwWnNJGDeZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSldzbThkaHlPbWVGSm9CNkRUdERWNTJOSlMzakVCWWx4YVhNQk56NyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952068),
('hr1eo39pbb7Y1J9uDJjkOOQWi4wUCBYl3WCkLyh5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicTJVaGJFM2JmWUduZkdycllCakFwaWpPaWliMzZCQnliNzJCRk5SSCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949880),
('i9PnuYLSayxktKmMJy8VnL3PCr1ecBM8OmG1tY4f', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTDVnblA0UjJzTWMyUngzeUtmcGp6c0h1Q0dNdFpWc05yZDFDZDhnSSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952070),
('IecGCDA0diIBFaoMeHcrn5EE0TYZKAtpsswKTN7v', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiY21DSXpEY0J2alhBWTlHMVl5c3ROTXVyRjdWWlgzQ0RoWk9HWGY0NyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952269),
('IKcBYQGzP9KwbwctsbkKRN6Y4aQp4sUXJGyHpDZG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUXZkYkl0ME53NEIybjZVWm9Ma29lNFFhUFhxbE5KbWR1SUVUeE1NMiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951801),
('iTkGBgJpcBSIOOUliilOlsNbybzP8Hoc3BN8wila', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidkJ2R09tQTY5R25EVWVIMlpydGlPOG1xWkt3cHd4S3BJWkdkUk13TSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951858),
('J6mCdAhoQrbSDB5MoPChdUFCCUGghrv1SazF4wbf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiU0UwRzdXSTZCT0h6YTYxaWg4OUJQS3p6TWtZaEdvVXpCdEZqcTF0SyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949285),
('JG8WijAp4DAWIoNit5oQi0IbeUw2gsGSRNaQCqdV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTWhIUndLcDVGeEVDSG03NUxDd1ZMT2Y0UzlreVdDYmxrTmJpSXU3TiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951767),
('JjppPvc7cQaagYb9bhQA1ckQUuHYM18czclJk78t', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidlJ0cFpsUUQ5RHd3eThtdm9RNFF4NTdCek9heXd2SlFsU2s4a3ZSUSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951857),
('kpK2eW34Akw8tBWU6tvLDO6ka0CTzinp7qu3gvgH', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoib2xBN0lJb1owM1Z1bklkSnBsbFMyaTBnaGhpcGd0blh0dGtRcFJ0bSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949470),
('kPwtFwWwp00EqxAKcqXNPXYOkJto9dAEsCtIkCzu', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUHNtenBzeUlzT01QZXF6QzloUk9uOEo3Y1c4N0NUcVNjRllkN0FscCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951807),
('KrgGH2cKnxsc3Ak9OlWTwtWoQSFEoVlTNBlo7lni', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSmdHM2g0dEs4dlBXaUZtUW1TV1N0eExJbEw0TlhRNUhJcmdYUEhpUSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949264),
('lC1R7492PzpBwOkdka5w4wBNn0CjnLqAGCpjOlVr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRFQxRDJGa3N1TUdDTDBZSkRwNVpKMjBIU01pR0pzeUlnc0pjNTBmRSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949285),
('LFcUNZ8anmDuXw9BgGVKIWAi9hv0qRIiZIrGpztk', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNWxGUGVqVndiajFLVmM4eWI3NGFKSmRlbmM5amxuc05uNFIzZHZLUiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769950182),
('lo2zo4wcHXuk96fkKSQmMOZKr7mGpIg52liysa7S', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiU3F4ZTA5cHpmd1JRWHZOQ2x2ako1Yzk4N09QUjZydDI0V3hQVHNRUyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952271),
('LpTChIt8YiYBYJ9xUvNedBcFNKXyZhIPDIPzexGA', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZ1FoaEh0SE1tMGJwVVVkajZwWVh6dGRHRlRSUGtrdE5adDdyTHpoVCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952277),
('lQ5NfL3opllNBnyfmYKjtmJ3i2uYelv84vQ3PrJs', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieHZ2Nlg4Um1GVFpOVWx4U1BtTFNBU3hQRDhDQU0wTUVnNVI3VjkxdiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951801),
('lSoQNlxNaBvc09CKeIar53DIQm5CdTujcUJcM0xa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoic3lxRkZsS0ROOUd2TXpxY0pkVUtNTnlyV3RoMEk0TlBqY2Q2bGduMSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951275),
('mBBYolFpa2MK1TnBH4WcW8Ih6EQqUYdgW9Vk1kGN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiREl5SjVRbUN6YkxacWhOajIyT1BXTXVNRzVwd0hmN3pjRmRVTDdpSCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949881),
('mfFuO09pq6n5agBTvsaAzCWllDBXFIh1TeCvHq0l', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZWlyMzNMVHN5SlJUR1hhZ21FWW5HbFFXb0V2TmJvZm5Ub3FsUzh4diI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949265),
('MJrV4zjw2nM0Wk6cHZXswNYjFTORWkdk86cTXAoi', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUGl4c2dvU2FrVkVrNTRESGo4TDlKOHJvaVZMdnpVOUMzVEJkR2JJZSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769950180),
('mO9YWKycrcLmIsquEsvom7uTNSWfvNcyURzcIlTL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZ3BXd2F2ZW1GVDlxYTR3VTRUWGdGSkM3bHM2dHhWbm90OUVCcVhIdyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951823),
('Mzm88pGd1P2dwuHCy71QdDv3J7KkHBD0ieZqkv4p', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSHVHS1JSWjVKWUx0SHVsSVZrOE1PN3lzTzVjem8zWEx5VWFVUW55TiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951550),
('n1kNAe53cnIpQSrGsTiXYPOhF2OKWvcrczHpDoEP', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWkJrbzVJY2dwZ3NRQlRvWm9LSEh1TTc2MmhSQndnaWpjeHpJeDI1dCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769950180),
('nFjRdQlayOGjHqc2HrdbOubLndqJbKA1m6YMLcJX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiMmYzMjRvUG9Nck96ZlZLYlFTRUJBTFJIMXVpYUZrNGpGd2h0YmtVNiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952278),
('nY4RPkhCDXvOdwWGFPOQOYTEAy7ywODWbO6emSFd', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOEtvaTJEeFFmNVBDa2taVVQzdjhPalRGZTEwczlBeFpBYzdxODlTTCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949468),
('obPLqV7i4oz3PPb7aHFNVggzgfan4BumV2PFbLcv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibzdCSndxR1I0dTBWVGxzbXByVnlNUlp2SnJlcndPZnAyNmltUjZLWSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952272),
('oS7BHUeWcXMSbhlxPR3CoLxUNUGhGcvhAbPFuFwa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWW12M2g5Nk83dEFwZ3g2cjdpaWw0N2NTUUpma0tXVXltUXZETDFnTCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951622),
('ou9oExTyVfUKukCJSEluuJqCdnadsoYFCScLzPMZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNUdjSHhZMzlIMTczZWpMd2RZeWRKM2pMZGdET1oybTQ1QTN2S3ZseSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949253),
('owkmhCMzcM9DFrlQwYiCom0LR1rBP3vjs3qWPKsz', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUTUyTnZNTGxTYjM4aTVzTnNBdWRpSUdLOW5BVHFGcTc4ZDRtSFRIYyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952304),
('pEngHxGjAMjOM5W3feoRE1cfDRgNaHlYt0YmyAqC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibHRrZnJPdnBidGs1SU1jSVhrQWlnOHN3RnMxYjFYUmNvNWc5dTlsTSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952273),
('Q8r7X40praUZWlOGKtlrXGATuajxDmzQ6BYpjE5s', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiamVZaWxabDRId2M4bWpnNWVsM1Vob2E0S0pQZEgzZFdPOUpRRlNZUSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951275),
('qfjD5XX81Mw4gupuSjukozcCa5GZclq3U1jKxl18', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZlZHNHEySnE5RXhIQllMcTN2cnk2c01vdlZKam5TU3pzbVBBVmx5aiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952273),
('QsbiXINvzXNyXUqmME9Kn0NjefHt7fAme8d8JCBi', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicGVqWnQydmN6VENyZmZHdG93UXlTY054dHhDNzRTcElwR2kzemxGeiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951807),
('r3qhhreWk8YDxBB3BkWN4yz9bopEmVTaqzkwCYhx', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZms4SWNPNUxrbnhmWGhSeDk2WEVvY0FhWnVvTkVmQmRINHlpeDVocSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952260),
('R6WlzRKIvRY5EjO3ek3a1AwiS8cl1NbAGehw7nPe', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidm1lV1pGdzYwYzZEZVY3dDlmU0t1alliWUNFbUJpZTV0Zk5wa3JLSSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951856),
('RkVFS8Lpp7zMAUqopakPXKx2ZssTDZTTuosOHqaL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUkpLWHpPWkwzYlo1dEdqaHJLMXhJQjdBU2ZPTFlLc0tJdE4wQ1dhZSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952119),
('s45jTuJJjXaxhouQPrciGw6qn1QC9AiGeRu1g7PF', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOEx0clhXM0g2V1pkMksxQmNPcjRsYXRLek01SGlHSG90RVBSR29lVCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952276),
('SHbvnBwdLcSYrz7euLBcFCjp6Hw7pn7uGL2aWjGJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZFNKSkpOdEhHSjRCRVRKMUtvV00zczNYcFNjZkEzQ2xDb3NkcXZMUiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951550),
('SRV6m2rhFj7CkTs0iCRd1W0T0i5gUTkn5oLiijfw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUXdORTh1MGhkaXYxb2NVMUUzNHJBSzMzWWV3YTdBeUU5bGNxbTNmTCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949881),
('t8fjbuSG2INUjwnDQpNFa1qaeXyvrSvyEced74eV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSUVzMXB1VEhWODRzS0lURGNLbFhrSUpsQ3lmZXpReDZzWFpNQWpXeiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949267),
('tX61YkeuxUpxcWyBPE9CeUqdJRUnyMGjXmeTGBlT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaWl2Y3JBRHdCbmNJZkZOb1E5cHlUS1hwam9jUFZ2NFp2aW1IQkZraSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949259),
('TXByjqRvprkotpMkdmylxV5ICp6uSS0Ce3Q1rRZJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRmQzTExucFhQdThOczFFMDlyMng5dXk3bGpjWWxxN3JWNVNKb1czTiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952069),
('TZ8ACpj1VEqmmsefy5JXKPhlqW5a5aVJPr2paVLr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQlR3d0dzT0tiNkNEakRBaXFqMGQ5V25GZTJWVzk1QnhCTkt1SW1nQyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949263),
('tzSqVJrrUxlyLKQalcxlqSxQp6UIevhjA2FHxb2U', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRDJKWFZ5Smo0RUlWZUV2STQwekZDV2lKOTFVTEdsNGxSUFJ5clZldiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951275),
('u5qa7s9J0WOSBzBwVOpeT9bhRv9oTHp5w8D5LH15', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidWJyc3dEVHJGYXdWN3RNVnBSNnlHTzhHNXRaM3gwTDhiNkZOVXhmYSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949283),
('UK9fFjtOysvbX1CF7UjoR6X76p7o0yDBBg8kXPud', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiT0xveU1UcDRJOVJpUkRHSGozWEdkb3FWaW5BY1hXOTIyNzFoWmxvbiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949260),
('UsXhusPjmH308BtW5fHHVW8irx0RcpaX3ovhQlK0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibzNYT21oT3NQeHJGNGFBRmI1OERZeDFzRkJVQ1p2c1pCMDczS29nciI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952008),
('UyTMOetuHJ92QEqNgnle5We80NqehvhoETp6FQpf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieGhhV1drWnRWNjJuT1RZcXJXeGRVN25CY0FXSXQwa09xUG9tUFo1VCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769950181),
('VCsCbAgpHj5o6OMbBU5nkmHGhzYc72mv44cVK3xV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVW16dG41SFVGb1VhekJ1UlhyQ3FHYkVSQWdOT2tiQ2xuQlZNQzgxVSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951853),
('VLOpHUMOrnJ8yLOC0riebqQIIjtr3QHRQVd0NJXf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWTZVcGVFRExlMEZ6SVFNOFlOSldyZElDTEpOTVIwYUFXZzNRWU5qcCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952010),
('VwQih0DZ3FLML1pwRIxxQGsjHFUmxBtodxZUNt7x', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRWs3d0JyVERVdGozZjUzMjhJVkpBVE1CdW9lOUJsaE9jczduclZQTyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952302),
('W78WxtUbHq8bAafCMatd4B9cuvUfeiSmOk9mqIpQ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiN2hZVXRHMDZicnQ2amgzZUFNeTBNU1pQRk5OZEJKOGNFRXRFdVdZUSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949263),
('wCiVa0x6R5G0zpqIyTVsbsUyFciNeOVWFRiZ2OHj', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSWxkN3h0cWs3VUdZZTZBMGkzeUJhd1pRRDZMTjh6M0l4NnJOWFNZeSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952259),
('WXYOkXmFoGp5tWDzBzIrdJH8O3v7vRKV5wK2SUBq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNXpFU1VvN0JmbUMydE9qanJGT3hXNTA4S2RheG51ZlBFYml2SndXOCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951827),
('x5vGmjNRVYvMlPyX88moOd4HLhQ46gOTqGarSQOn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZ1NtbmZOTDRJeHNhUnNmb2ZIRDNNd0ZMeGREY0JmZ2p2U2ZPUGp1aiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949261),
('xB6jQvBvlPEAqhIalqah1V56f928zTj4Ftgvma9T', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiR3JBbWFydVBzUjNWSk56TWRoRjJpeUQ0dGI2SVAwb3lIWms4bDJWZiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949252),
('Xgoqk0HslrqgwXCVCDJJGeQzbOp5CguVNIKtJoTN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidmcwQll5TDlsYWtwMENxOUw3M1BzTUdZRXRoTU5OV1R3ZDdMZlpKMiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949277),
('XIyQ4bR0qhgvdBged2VboyX2TPKOwXYpM77yDiAs', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVW9Zb0E4TnJhNHpZcUx2eDVCWTduaVdaSE5TSU1sZVZsbVladjFBeSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949279),
('XNN5f9a2vfCWpjSgQQ8Sj1uQPB2SdZTEkhGVWPs5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWFY5dTBiOTFyY1NXS0FYTG5lY2xtWUhacUVhRlJPaFdsUDVFM1NyaiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952272),
('xoyafjn77KtJ929SYrC1sIBQoXEGAR1wh5lUWrfT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaUFCbWdUSk5kcGtGYm9tcjNDSTk4V0VGVG5IMWpaS1dZQlFMT3FrSCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769950175),
('y0Pp5PNazxigrYWJtwQZ255HWqXVjhKsC39Tj0nP', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTmNTNWxLOEhoWTJWeFQ0OXo1dmdyNTZseERyclZSVUQ1QVVwaXZWNiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949470),
('ypwsbwd9RIU2R9o4F2JVGqsLeP16uzmkZpw2ayZY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOXV2WHUyS2FmMG1RTmpLVzlDYlU5dWFDendpOFpOaTNHcHd4TU5WTiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769952009),
('Yzsx4xSCp1Pwm8sCey9lwxtqZdiV0BWDanFnwe8Y', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSHNMM1J2MFU0UnBuMXVHY2trdjhiRWVUbE54ZDVpWndWSTJZRjRXUCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951827),
('zAoxeByDKwpCMtepMvoZB5pRuEkTwbQgWD8SVAGn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicXRhOEdwWVdkeDUxZW1yc2N0cWRTOFFtTjlSQU14Y0JWcjU2aXVLRCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769951803),
('ziKbDbmpE4JpgaQoroUNWaDPbQcHV7xKkEXhu78e', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiT2ZmMVZJTU93TVdSd1diNllZVnM5aERIOUJKQ01PVnBuNDROUUtPRCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949258),
('zyuHurCr1QIlKlix41RGOaipLkVL0DJ8DFz8malN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaE5pRkE3eEE3VENpaU5FVllEOG1zYlVjYUdrZVhYUzdnWGRwelRwdCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769949262);

-- --------------------------------------------------------

--
-- Table structure for table `soumissions`
--

DROP TABLE IF EXISTS `soumissions`;
CREATE TABLE IF NOT EXISTS `soumissions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `devoir_id` bigint UNSIGNED NOT NULL,
  `etudiant_id` bigint UNSIGNED NOT NULL,
  `fichier_soumis` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_soumission` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `soumissions_devoir_id_foreign` (`devoir_id`),
  KEY `soumissions_etudiant_id_foreign` (`etudiant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `about` text COLLATE utf8mb4_unicode_ci,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ETUDIANT',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_status_index` (`status`),
  KEY `users_email_index` (`email`),
  KEY `users_username_index` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `email`, `phone`, `address`, `city`, `country`, `postal_code`, `about`, `avatar`, `status`, `last_login_at`, `last_login_ip`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`) VALUES
(1, 'Admin', 'User', 'admin', 'admin@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ajx0wsjDyfQdFSaRNRFGUBTis2Ka53q0IyFRTYUM560Yiiv9nXJwlCJ8eX0a', '2026-01-05 16:29:56', '2026-01-31 00:49:50', 'ETUDIANT'),
(2, 'Professeur', 'Alpha', 'prof.alpha', 'prof.alpha@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ZH4jKKD5Vd2mUg4uTye6wc5kxZV1z4sODFw0RizuusfUvezbL8XwhlANvJLe', '2026-01-05 16:29:56', '2026-02-01 13:17:33', 'ETUDIANT'),
(3, 'Étudiant', 'Un', 'etudiant.un', 'etudiant.un@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mEVpGhMY5trl9VD8SqTa3cD8hYYI5MtIy2iRL00mRTU69nzppd1gxeHxoRnW', '2026-01-05 16:29:56', '2026-02-01 13:25:02', 'ETUDIANT'),
(5, 'Abdoul', 'Niang', 'Abdoul Niang', 'abdoilniang00@gmail.com', '+221777375899', 'Guediawaye', 'Guediawaye', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '$2y$12$nXfANNyOTi4pubPyS.9ykOSPvYF.uubfpe0TtchWFlVmvt.BrAKLG', 'N8arbTwWy2M7fvxRt2FdSXGjgg6o8mDTOhX7gX2Z4r8b7EXFXA6Ca3ZwSbjB', '2026-01-27 19:52:15', '2026-02-01 13:24:29', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE IF NOT EXISTS `user_roles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_roles_user_id_role_id_unique` (`user_id`,`role_id`),
  KEY `user_roles_role_id_foreign` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2026-01-05 16:32:56', '2026-01-05 16:32:56'),
(2, 2, 2, '2026-01-05 16:32:56', '2026-01-05 16:32:56'),
(3, 3, 3, '2026-01-05 16:32:56', '2026-01-05 16:32:56'),
(4, 5, 1, NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cours`
--
ALTER TABLE `cours`
  ADD CONSTRAINT `cours_enseignant_id_foreign` FOREIGN KEY (`enseignant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `departements`
--
ALTER TABLE `departements`
  ADD CONSTRAINT `departements_chef_id_foreign` FOREIGN KEY (`chef_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `devoirs`
--
ALTER TABLE `devoirs`
  ADD CONSTRAINT `devoirs_cours_id_foreign` FOREIGN KEY (`cours_id`) REFERENCES `cours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_destinataire_id_foreign` FOREIGN KEY (`destinataire_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_expediteur_id_foreign` FOREIGN KEY (`expediteur_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_cours_id_foreign` FOREIGN KEY (`cours_id`) REFERENCES `cours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_evaluateur_id_foreign` FOREIGN KEY (`evaluateur_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notes_soumission_id_foreign` FOREIGN KEY (`soumission_id`) REFERENCES `soumissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profils`
--
ALTER TABLE `profils`
  ADD CONSTRAINT `profils_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `soumissions`
--
ALTER TABLE `soumissions`
  ADD CONSTRAINT `soumissions_devoir_id_foreign` FOREIGN KEY (`devoir_id`) REFERENCES `devoirs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `soumissions_etudiant_id_foreign` FOREIGN KEY (`etudiant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
