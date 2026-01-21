-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 20 jan. 2026 à 14:12
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mastercampus`
--

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cours`
--

CREATE TABLE `cours` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `enseignant_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `devoirs`
--

CREATE TABLE `devoirs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cours_id` bigint(20) UNSIGNED NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date_limite` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fichier_joint` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `expediteur_id` bigint(20) UNSIGNED NOT NULL,
  `destinataire_id` bigint(20) UNSIGNED NOT NULL,
  `contenu` text NOT NULL,
  `lu_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
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
-- Structure de la table `modules`
--

CREATE TABLE `modules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cours_id` bigint(20) UNSIGNED NOT NULL,
  `titre` varchar(255) NOT NULL,
  `contenu` text NOT NULL,
  `ordre` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notes`
--

CREATE TABLE `notes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `soumission_id` bigint(20) UNSIGNED NOT NULL,
  `evaluateur_id` bigint(20) UNSIGNED NOT NULL,
  `note` decimal(5,2) NOT NULL,
  `commentaire` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `group` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `permissions`
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
-- Structure de la table `profils`
--

CREATE TABLE `profils` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `photo_profil` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`, `display_name`, `description`, `is_default`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'admin', 'Administrateur', 'Accès complet au système', 0, '2026-01-05 16:10:30', '2026-01-05 16:10:30', NULL),
(2, 'enseignant', 'Enseignant', 'Gestion des cours et devoirs', 0, '2026-01-05 16:10:30', '2026-01-05 16:10:30', NULL),
(3, 'etudiant', 'Étudiant', 'Accès aux cours et devoirs', 1, '2026-01-05 16:10:30', '2026-01-05 16:10:30', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `role_permissions`
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
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0DvChBm5XRNS4BQNw1pWxkbQY5jdR1bCD24mlTJK', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidWZVUk1VdndrUHk3OWlyTVdjU3BhbTR0WVlqdlhoVGdUMktJOUtjVyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900928),
('0ghHQBqqwIVbsouaqH5MIT90vXaZS2ed0epSlFu4', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicHY5MG5vaU5oYVhBbUFwb2dtMkxUWHlFdzFROWNvWFRMMTluZ1RtVyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768913587),
('1wyuOvWeWFgTOY3CIY6sqbBiIIasLlv04RyBn2hu', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicFRReGxmaFpOMlhjenpRSnlSOVFBZDlwRGpmRTFGa2N5bGZnWGF2ViI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904658),
('3HU5ZYRI33faz0sSt0Mstuv3gyUbPLklNRwNCn2i', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNHVFaGwzaFQyVVhrUFNjZmhIamh5all2SDFvaEdrYTZsd2JleXNjcSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906426),
('3l3BrumuUJsnSrtcKlCk8sPEBQawLJRiZmOOBMPJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSGdoZ0tBUTZMNHlFWVBEbjAweXpzaHMydm0xenE2ckt1SnRmaTZBOSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768907153),
('3V3ivwBgZckbh9YFyGGDCkPttwpacRKKHZlAk6NZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoic0szTzJzWkNTcVlLd0xzb1NobkU1TjlnVFRmN0EzU016aGZ4SmNXViI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902354),
('4XQsXD7otglZBsVqn1lVd5LKYp5pukciZHRzIOdY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQ0MwVlc5aFVSdkNnYkFxR2RKV2xGVjRqb2lDUG9GMWtFYjQ1akJZWiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906445),
('5E0XKqDZ5x7f0kFejfNgfFIW9EfffaMcNniVtlZC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWTB2Q3FFTmdtOGhMS3dDWXdyTDNMMHlWVFczaU1nWlpSdkNGWDdtOSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900773),
('5OZr31Wf8HDSeG0yoZh87bAvMFGl0Pa0LVdyQVTP', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVjdJY21lSVJUUFFlOXBTYk9oMURxTVpzam14blplcFE0ZWlES3hrNCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900725),
('5pe0V4wOvj4NMwWmTT8v8WMSCo6K8HxrX28TvYqV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSkxmYVhlNHFiYkN3VUFaYkZqY1ZtSWZUT01POEJRZXJlUmIzblpHdiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902354),
('65dMxnj7mSnXxQQ0CbDazmICwdQEILkpTpToq2wR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibmJLVUhBNmp4MFZJcjFpR0lLQjBZMmxtTjhubjRsdHNKSjJvbFVlRyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904657),
('6TOzumpVGUdoKICMAc8rjsAyDKAz5hBLZkSKrSR0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWGxQUGdGbDdFT2NFdmJXUFNrUjlaMWFNQnhUZXVqQ0ZnSVdtZUdSQSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900773),
('7xmce8uCG9zfE9x50KstfJHv5SjS0t9OegoAqvyN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNDZHeWQ5OGZCcTB3amtadFdNR3RTaGhQZXZFbmlEaHZBNFBtS3k0MSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904659),
('8rZvhdSrasGBbUMMNpco3n30yWc3jRZqlkXhGq7V', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQ0t3TFVWYldNWFpZODhSNGNXNm9MbHUzTjRmVWFSMmVTMTJ4QURidyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768913616),
('A1X739jKikcEaT5BArQ9nhBSIe2FvhZJViTETLCK', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNEEySGV6QmFuWUFDUjFFcnAyYVZ0akdVOHF2Q2twUkVnTnRacTU3MiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904887),
('a3MNlg31Ned5kRSQ2PlLZv1PNyRkGykiUSdC7nko', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZWlDQVBCMzN6dktEQjVHZVh0RnRob25GWlhnMGtQY0VkT05uQnZOciI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906536),
('aFDlpdnrGZU9iBz3IKuMbHSMs7DGAkjJLMZelDVC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVGNYbk5Gd3hiSFRMRGZaZFVHSXdQaXZSVWlVbzY2aWUyWnRQZTRwMCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904899),
('aZ8wsDTLZA4eP1y4vLltQ59lHos7WmxfEAiww9j6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUXk3WkRkVmo5YUY1Q2tleU9SeThuWU5iV2ZNSnJKeGRvcFFCUGpPUyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900632),
('B30pPWf58JqaRX3yTW5YV2Wk9OCslP8tLOuzQz2u', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiS1V5elZOZG12eExCdXBQT2FrNGxqYURwYzlFTWhxT3lWdWY1bFV0RCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900631),
('b5tzEUwYmx3PUB8yYCd8SJU0AWXw2enwPG1dOjCn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOE03YTBvdjYxc2p4b2EySHNSYURVcnZEQUh1QWpDUkhteVZCYjBQeSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900969),
('B6v8GlVSemvO2wh6ue3dpcDnhQQuJAgcwSK83Dbh', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVU5nWUpRQ3owekx3TVVHeTVodFpibkd3T2RScDhlVTZaUTBLUm03eiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900927),
('BgS06uFuC0rWZSOWchVWG3hsRNxHcaiCCStPgiIt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiMWE5Qlg3dlpXT3JGREYxWUlrczJ0NTVpOW9ydGtHZVNSNFhlVHc2NCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902358),
('BH8XQMCSvvmkQUWIZeg1gYSY2D5IwFwDEVby3bY2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNVJhdkFFeGlMTjhzSWdGNXlTMEQ3WllZejYza3dQSTJLcVZJUWZ1eSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900929),
('bMEMnyngHxy2eQL3t7T1JEweNuRqCwtgd25cOAnJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiS2dCVlEyM1I2SnhnV0Q1OFdTRkpHZ2JDc0NDSElydlE2MmlZeWRpTCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904661),
('c7OR9bCwhFYPVwhtGpn0B8aNpYby3WWkKKEPJBie', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiazFvdnI4YVdxb2tjOW11OHNQQ3VRUEd4d0JZMlVZeTVtWTF5dGs3dyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768907172),
('d3f0jM8K2vzJoK2Ke0cICIQ2u6YfD2YutAbXrQ1j', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiM2RxYUVFeFBOd3p5bWR3Y1M3NkZwSE1HajJCNUU1YUgzd2tSdExVViI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904658),
('DgSgwKzbJXhlfabGZwRNXTTq9WL3yaoXebxLim6q', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibWZIcHFuYndXMllPcXlPaDNadzN2dEJ2bWFuQU1kc3QxaFo4dDM3eiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904661),
('e8VS8ZuNnK5zPKFbbDiymd7P7nC2wOC5ohLreFvR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoid09iZExwcDYyU2IwWkFySWRDRUJ2bUdWTEdKYW1pSXZuSDFNbEZCZiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904658),
('eeFYuM6Pcyv5eVtME74o5lMYnjbtS1yp9l79uREo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSDE1MXNONlpkWWRSOEZQdVZwUlhPTTl2SnlGelpEV2hIUHl3d0hCaSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902357),
('FHbN8PzQYWi0zeumy9wJfwyaWxRjAOZyqt3xELNE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiU0lzaTNYSXhBZkFhQUJLaUliUGMwWnd6YmtHRk9kemNoM2NXWGREWCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900772),
('FyHECIn4Wh32up1f4uJTyDFBIpIIY59szvyYmQuf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRjFXMTVGTjBpUTBPU2x2Z0tuZENYZGp4S1BIb3E3QTJpaXQ1OGN5USI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900773),
('GESabP19gHxGBrVlxYpb8UdKVc4CJiu4SNhGcn39', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiU0ZCSUVSYjhZa1YyOHIzSmNuMlpWTmJscVJJYnEwUFEwR1VFUUxqNiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906504),
('gVeFbKT6sa5BOYBsqQokHooUKQCYmCAqHjDwnJtV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYmpucHJVWmhYR3U4a2xxc2EzQkFybUZqeTNxZUh0SUhiSVJBZUlqUCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904661),
('gZd05OavVhu8V4NP36Bv51bksKpWuYyANEfZPK99', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWk5yU25IdkFzVFdVSmdUMWk3ZkpTNUx5YVNEejhVbEpveTVMaUVpTiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906433),
('hBoP26jiRc7eqVMDIBP7yi3tJznJtqqKkHjX0ZRJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibEdMVHRadEdQSE5NTVNlMVhqbEpyRVlTakN5QWFzYkxwaXUzQU1FcCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900941),
('hSiWngMifRlu9WMfyS2XiPOuJBjABgdoIztgLdvj', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRnkzdEllNk5oV1haSHBDSm5GeENYMjVzQlNOV1JsbWJaSmY1Y3ZxWiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906513),
('HwQJZy48gwbIbwwM14gsCdvmhnGesVjdlI1Mx5S6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiT3h3ZGUyT3RUMm91c291THh6Q1Z5MXp2ekR3QTU4TG43TXZqcWNzaSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768913595),
('IeLqz3xoU2BkINBskCvf5xcJ6IM0rkjpgRL52WHo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVlFEYWpuVlFuU1M1VGt0N09TM3V2Q3E3b2pyc3NENDlpeXhCdVhnWSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906429),
('IgKUgSHlHMNpjUswl8AD1OTsTiBOVRDW458oJIwC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoia21FZGxVMFRyUjNSeXBCSHdpOUg5OGZ0RjhsV3pxZllqM2xKNW84WiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902354),
('iNmPDjSIjAZorHbv4D8Vg1FIMD21JoDslJHTVoDo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaFlESVd4S0F3WldMNDBuZTZNbEU2OXJ4ZlNMWk1EOGF3TmFDZ3RLayI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900940),
('iTcQquxwnoWmV14gyQgC4yysL7fGrQKd1rt9fsDA', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZUNRajRmcjlQYjY5OTdBSFB6RTlKZFhNbkRGZEkzZGU0QlFwS2RQbCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904932),
('IwN1bTSSeRnFoHE0cvApXoxynEtUMd4fSrPXGg1K', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUUFZRU9YWk8yb2NzWDVpT2dtbE1iVDNIUDBHTm5JNVRueFhsekVRaCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900631),
('iwOmuQDGh4eiGRVGV3gpL1Ndis7rjxgdRa91buVr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQTRjYmQ4TEVNeFM4Y01Qd2pRblhiSENDNkhzQTFzSTVMVlVqSzVTRyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900927),
('IZIxOlN7L6XIg5NAXQDEtuqdnigUBb0gbCKc2qYx', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWWJCdm1jRHdrVGxKMkZSbXdjbEZvWGc5ZktreDhHWUVESzg0UWFlUSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902355),
('jBOIWtLQtlEcy5WYHMLKQzFdmFtjHLF75f47JQCc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNXlTYzNyWnBUT0lFd3pMM1lKWnRPYW55cTExODZVU1BiREd1Qll2byI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768913596),
('JDJoKaQHcPtp0cT7im6TNeBpk064S8opHuhCaCYd', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUWZDMHpMd3d3blJ6WWxuZko4QU1KSm5XZmN0UTJidzBZU0Q2azY2NSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900628),
('jdQuLNz2mORmWA2JizrvDDt3r3yYdYrOzWnBMAbk', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZGs2T2hJVFlIdElVdURsT01VcnhmNUJNRHkyVW5CVDczSnd6ZzRvVCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902358),
('JDVGg0BXy1REXlimi9pbroihDbBHgmxnn7BoLyNb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQkRqd3NpbHFKM2s0Y2dYcTRZNFlpNXRGbFFxWlBWcGUxTThwRTh0RyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906535),
('ji46d0Ts4c7GhO8RxoDiJvLJjqEWj3y9NTF4OWlI', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiMkUzVGxMQmNXT0tMWWpPVG9lT1RGWkUybk41YUhjSVg2cnA3VHFQTiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768907149),
('jnKjEIVAbMWpwf9Y1PVPb2TuZ3nncFLsNN8ngz9W', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNlhjN0NONFVEZVhqTWlGMHoycHdxRWRDU2s5RmMxNGV2dlFRdFdiRiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904660),
('JXmdTaDV6grPTLsxrWmHMlNiHUSW4VD8x87EU62n', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZmJWRXo4bnlwcjVkeWZia1p5RXZIUnNEZ1o0QUs0Zm95N05VSUFxYSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900631),
('K3hQBfj8tV3VBgkfgN9BMod5Qb5yOxxPYL5gVKRD', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaWJINUd1MlFiNUt6aXc3c1J4UXJ5Vk5uRnVXSUN6SnA3NWV2eWdaSiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906444),
('kaF1k5oXw3s6eiV8pGkwCHLHJCuDrda5bXbdavur', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWm9mVVdKYU5XWkxmRFA0bERPMFdJNHhXa1liWGMxTDRkZU5pclVVZyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768913596),
('KwhFuZ7KCkUorA7hOXk6IOS4XSQUBxsKyM89QDDM', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOU05YVhOVlNZakh4ckhZNkNsRkhSN1dNbUNtdnhFQ0d5RnNST3VsWCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906428),
('le2znTpA7qAo6vgIMpXTxUUk4YNbEhj2fr1XW9SO', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYnlPVGswNFY2c0hKYW9rcHRMZ2tZYkVrNGdyVUxWbExTMmhFU25MdyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900940),
('leiIaCN8JOETkd7D92azoThbByfi0GiSpbeogTQn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiS0p5MUlVNGhmVktrNG5oSTY0YU45OFNNQ0d1blhBSks2cEVmU3BNdyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900729),
('LkrEaWJ6iQy6J5qFvZ8O0JfvVVlA3VbVCvXBZAWv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibnl4cE5pMUNsakVlenhJcDd0empnVURNQnF1Q0pJOFJqaktXaFFCUSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902343),
('llQ3YVPedsnFFaG7slCQznl02tkLNpPf8XYMBvSs', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiN1gycU5qNE1HU2lwQTBlTkhndHF4eUt2RVdUMnBmNGhTazZPTWJaOCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768913596),
('LtIvovgK2sM82kP7aJ4Uut3cLzOiRES5e4FAbds4', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiY1dFNklKWFFtSThIQ2xITUNuNzloOGYxMlpJZG1xSlh4Z2JBbGRHNyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768907152),
('lWk6h5gFLa24fuWF9jos1O0sKo7Y7GA9rJGFjSc2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUmxCMjg0Y3l0OWsxODlRSVdZenh6MVc5TG9wYzJJbTg4eGR2SGtsRiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906476),
('M4T2uL7VRnJmZ2iIOQ260sQFDzumKUP86lABItHZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUm03d0lGcmwyeVpOc1RHUDhhY2UxTW43a1ducHhZSVB3OVZmOTJvWiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904896),
('MV8zyjdnksQyQvUOSYhnEv5j4LWXbNZnD2cVLiwg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiS3licDVmcGJSTzJpM0xXWU9TSGhYRUFrUkVSR1dncmZFcklHZ0liZCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902380),
('ndiOa7T4cYRN8NapujgIOVCgvSpcUb1Ira2Ipacy', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiMWplWFBuajdMWENQNlNhdW5uNlR3RU1TT3RBWVh5Z1FGdGlWV0hsWCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906510),
('nYbU2xxBnTziNf44Vvd8SVlXCfpASk5iwLGSzGPM', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOTZpeklKcWY0SU96ckh5VFl5YU94dFFwOFowYmpaOHpKY3FKeE1PViI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902358),
('Od5pbSlKJ9QLxCs3LIPX4QNbv6OqpLT0F6oRiEHm', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieno1V3UzbmFRUWVkR2dCOTM4V3d2RHIyTXhmUldETWVHdE5od2k1dSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768912750),
('OiqllafisbCQgNY0YUwwOnKHJXLK6ymaCmYDc3VS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUXhNUTZFZTBLWjR1N3Q4d1NrTDdZYzVqVlg3Q292ZE1lYXVKSlVzSyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768907142),
('OoNNtM0eThhIH5R0Qah3agB0VRcjt1zCNgHByOa5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRmw3bVYwdmtJYUJsQ2wxNFVxSzd2MGNyTjFFT1pRN29yT0JsMFpBViI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900772),
('p4JF3AfyU4cwzkxlTW5MuAcPCHWXz7SpPZCQfqUi', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieThnWjhOZm5iVzV3N3ROUWlmZGNXempURlZ1YnZUQ2VVUXE3OXI2RyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768913591),
('pbzobxIksQmEnVnas6qCVKNlOPJTBoYXx0rmxvRb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQldwZDU3ZnlwUjZva2xHNEpsVEpvODluTTZlYno4QTR6UWdRNnVJbyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900925),
('Pf0o4apSsGCqGLEdsAU5QIvWrbO70hYD7bYpufgT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQWhteHJoSXJ1QVhySUx5ZjhrdDlSOFBRR25BV0dJQzJUNXVGS0FWeCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904906),
('pKoatsVHsP7KmipsEUKwXqn4vv4kfsxBuyE3hxHU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoic1lIVXlWVGxrdnpYYmxFcjV0bHlZTjFIVENtUUUzaVpXbTZPSFcwOSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904906),
('pznioRWuWFrRin8wLnbHD1cS8J9LoUTC6iCPtxQK', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSmZQTWw5cjU1Qk96WVE2aURwU29nMkVjRUVJRFRNZHZ0RDlkcm5lSCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900940),
('pzZXqgHjdxhdGVEWgPemayyLIX30IKVMgTVyh9CV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZDZZMkdycDRYRGVNcWsyVzN3cERHQ0tiZVNteUtSUjhLcjdvb0FlSyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906701),
('QGmeJSlTB1EDTH0gaZj7dIb4dCE1c12IBjNFJLT0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVlRsYnY5OXh0c0tDZXNMeGoyYUN6aWduNlhMRk40dmRwZ2o3Y3VFbSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902344),
('QoIL2AK7QNHCPrr5muYfs7ZuHVLKbgZWBLuln3xQ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiekNrZ0pWeXNKYkxRaWpiNHdqZnJzcXNkdFhVV2NpM2Iwb1VCR1NhbiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902355),
('qRxlEK4GV91iTu3yUptq188hoYZZrp2D6sk4sjZw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidkpsOTJwdUdWSDBBRzdQNXE2ZVNGUTQydGpkc3VRd0FKTlZOcFZyUyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904906),
('Qtmubzg6sK4lMeV3oC6CZJT9XGsJWfPzpkxyevK0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicThvdE9KNGh3VU9JcXM1UWp5a3RQbnRkcVNGV2lMTFNaUk5jWEhmVSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900630),
('r5mkiJtaRwE6SsmEDiMGfKOULBZf3FnpmytMOcKI', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZ1pYTjZKNUR0Y3h3UnpHTENlQ1ZlOHdnQnZwSkdsYkUwOFI4UTJjMiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768907150),
('ryqt83sYaYDKLe1gSF3HdZ1mlxyuycuUmLeQtq2E', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTzZ3alZ4NXNDV2NjMGpjaHR2Uk12RG5KOGxTa1FWZ1BURWVjZVNkZCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900773),
('SPo5CZaK87lI3UFXnAWa3Fvl7nkU3rnR02DaWG3K', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaWxvZmNUZWNvN1hjMzgyMnJ6Ym5ZQ09qUkdmVHNpTngweE8ybDU4ZSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906513),
('SW1jkQB78AwkpPHjh7dD8AmBzdz18vgjBQWpkByQ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieEw2eWxYdmVpZnoyMGp0dW5nYVFPS01aa1RxYVl4SDdWRlhvb1RWWSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768907147),
('sXinVf5hFx6fA521NuUuaV0tCU3VxZQH0oftGMuT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZnZNYmxzbTVjNUZ2ZGdXdU9GWGk2U2RjbUg0NWdyU0pid2lFS0NaQiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904905),
('TB1STRleLvHJpuTWLHRZSGeqtm8ejg5PXUAJVT31', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicnRjUmU2RGNTMmtzUzZxQ2NQRnJ1QkdaenFIUk80SG5mSVFrbmFDUSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904898),
('TbQQbJiHXucZ2VIT5ZgaDnVM7XyY3YM9IxAq5qO0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoib2duQ1AySkxwMnBCMUN5SzZvY2Y3RzZ4RlBhb2tSNHB5RlQwaHhHRiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768905867),
('tCmusE5cPeviQwZhgv1XwCPeNvhdyrbUdzS5xgp1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSUEzVXlNMWE2QUY0QTVSUmttSk50b3JqMDE2Z3ZQWHROZ25pWXpuTSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906432),
('thNwRM8Qf9OpUx5YQVIonvgk3riwHdxPQZPyabvw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiazJIcHR3RkpwVjYxSUdhMkhSYkVwT3B1NjR5aUMwMFFhbEJFQ1VvYiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906948),
('tK1BMW8PC5p1KfqszUYgChUKa3jB6WONjwYT7VFt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiM0l3NWEwQ2tsS2M0c01xRE5XYmM1U3h3UFBZdlZhMGw0Zmsxa2N6biI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768913592),
('U3LDqQlYsjILTGr7E7Qa1BBDX9X5OqK9blqVospc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRkwwT3NiMGlpbmhWZmdSM3B3VFRiQ3JZaWdPazFyZzNxcmVuSlVreCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906419),
('uGCB1tv8bWN1hfUmjztyQHLTOvfOweXY0rCgGqb6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVFpTZ0VjZjlpQmViUUM0cUF6Vk1LSWVzbno1VXF0ekhxZ0RhV20ySCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904699),
('vcEThUn7GSDPE4eCKZ9AsrFwWlemLCXsL3ZrDH9d', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidEV0MWRndkszWGttSWlqeEtCOGc2SE1sZHRBcDhtR3UzVWl3dE9jZyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768907153),
('vkhEzcXGmxuHtqmLjOM42pcIN1pBDdI8rb8b8EdT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYlZrUEhVY1hBRUdLc2hXb1F4SmRaajhHQm1VVndQMWdZbjJ0NlZVeCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906432),
('VtSTqXOv8WQxV9XOP6HG3qa4ZAbqou5rl0PW3fwC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoialQ1cmxFWTQ4TUFjZEFnNHFlOTVsT2k1YXFaVXpEN2lrbmd5eEk2QSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900928),
('Vz4uXzsIsVyDzFDpJaSYhCa3QlpMiFE1kIxhQHme', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOHFjMkJxamJlS1M4SE9SN25hUlc4eEdOU3ZCbmFVbTlMZmFYQWxhWiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900918),
('W2vJh1hPWyw5jOoVS4pd2OCappmieo1YMRrsVyqE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiODdvTGtWRGp6WEJmZGZoWFdqeUxVa3V5V01ZZURGUFVvQkFPSDJrVCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906498),
('wAUK8oG2tMKRTTxePqLAPns1VtXRn8eVlk8T3MSP', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOTk0bzdkQ3QwRG01WmdodVlpSThyN2FMdGVIQW12ZVBFZ2hYRGFtaSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904658),
('X0AxoNfLuGDcLykTgnjyZ40Z1y34IeItnTGqfaCl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQ3JqS1R2N0pzQ3B5OG0zdXhxUTQ0UDZXNDR3akR4ajVoQ1d3RTdjWCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900928),
('x1fHrTSM38TAp6sRTAHtm16y4PyscoBR1M7rkBBs', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTXdITFgyR2dUVW1LZ3B3aWJ2NlllT1RCb3hsRWZlWThOdktXU0xNayI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902355),
('XCwVO4BNq2V3AyMYEAP6jPX7cWSLFQVjoyXodQRf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiS2c4QTdqUnNPell6UVpad3VMeFVwT1NZbm45ZWNuaXhOckZUQjJ3VyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768907152),
('Xm5kTVWj5wBMCbHfrYPDzUbvMKruX1wpZGyGUHTf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaUt3cmd3NWg5eHU4Ymc2MnY1MkFkUjRkMnV6eDFJYzZXa29ESHlVaCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900770),
('XUaI2VgUKGxNl2znMYBHPCWUtvE9K7m5p6ehJIPG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYXZFTGZxZEpwTGlGT1NYUU15cExaTUR2RTZYRzhpbkNaN294ZHBNRiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768906433),
('xzlglLik4Skp08UhyZ79MClIaZOy5UVZI9UhZI47', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoicXcySmszaU9jNFJvbHFBU1ByWERoM1AyZnUwRmI1ZDFtZU1KeHpxaiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768902352),
('YKJ4xjCiBIsjnaUSfSNvJpf11KDrVsRJexzCQlEa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiM1RKVGZpY2R6a1BkZVhxV28zcjJlWVdlVmRrYmN3YzFBa0Q4STV5WCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768904654),
('zbCk8l0jYTG4HBemS0TtrYbWKfnA0kJcU4WWh7Ss', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiYWs5TWhydndNaTFJWG5FU1Y4YVpjVE1va2I5cFpUd2xKdVFKQjBCRiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1768900631);

-- --------------------------------------------------------

--
-- Structure de la table `soumissions`
--

CREATE TABLE `soumissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `devoir_id` bigint(20) UNSIGNED NOT NULL,
  `etudiant_id` bigint(20) UNSIGNED NOT NULL,
  `fichier_soumis` varchar(255) NOT NULL,
  `date_soumission` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'ETUDIANT'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `email`, `phone`, `address`, `city`, `country`, `postal_code`, `about`, `avatar`, `status`, `last_login_at`, `last_login_ip`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`) VALUES
(1, 'Admin', 'User', 'admin', 'admin@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vxykNkYu3pLKBG1xMPYizZnyifmOXx7j1dOXMBvGCuuM2Xsu6g7rGmYAFFSD', '2026-01-05 16:29:56', '2026-01-20 12:53:06', 'ETUDIANT'),
(2, 'Professeur', 'Alpha', 'prof.alpha', 'prof.alpha@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'YsF0xMd1wMU4yOPmgQBcQuGBehE7IQ7qnPhWyGE0nzXyNfgzCzMNIq6KSjtA', '2026-01-05 16:29:56', '2026-01-19 14:12:03', 'ETUDIANT'),
(3, 'Étudiant', 'Un', 'etudiant.un', 'etudiant.un@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DGRLBP8fPrek6fCFCbXllNsGfxuyzZgBu28mmUj7eJrRRrAhbJfGidq7p8rH', '2026-01-05 16:29:56', '2026-01-19 14:13:20', 'ETUDIANT');

-- --------------------------------------------------------

--
-- Structure de la table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2026-01-05 16:32:56', '2026-01-05 16:32:56'),
(2, 2, 2, '2026-01-05 16:32:56', '2026-01-05 16:32:56'),
(3, 3, 3, '2026-01-05 16:32:56', '2026-01-05 16:32:56');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `cours`
--
ALTER TABLE `cours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cours_enseignant_id_foreign` (`enseignant_id`);

--
-- Index pour la table `devoirs`
--
ALTER TABLE `devoirs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `devoirs_cours_id_foreign` (`cours_id`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_expediteur_id_foreign` (`expediteur_id`),
  ADD KEY `messages_destinataire_id_foreign` (`destinataire_id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `modules_cours_id_foreign` (`cours_id`);

--
-- Index pour la table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notes_soumission_id_foreign` (`soumission_id`),
  ADD KEY `notes_evaluateur_id_foreign` (`evaluateur_id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_unique` (`name`);

--
-- Index pour la table `profils`
--
ALTER TABLE `profils`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profils_user_id_foreign` (`user_id`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`);

--
-- Index pour la table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_permissions_role_id_permission_id_unique` (`role_id`,`permission_id`),
  ADD KEY `role_permissions_permission_id_foreign` (`permission_id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `soumissions`
--
ALTER TABLE `soumissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `soumissions_devoir_id_foreign` (`devoir_id`),
  ADD KEY `soumissions_etudiant_id_foreign` (`etudiant_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_status_index` (`status`),
  ADD KEY `users_email_index` (`email`),
  ADD KEY `users_username_index` (`username`);

--
-- Index pour la table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_roles_user_id_role_id_unique` (`user_id`,`role_id`),
  ADD KEY `user_roles_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cours`
--
ALTER TABLE `cours`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `devoirs`
--
ALTER TABLE `devoirs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `profils`
--
ALTER TABLE `profils`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT pour la table `soumissions`
--
ALTER TABLE `soumissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `cours`
--
ALTER TABLE `cours`
  ADD CONSTRAINT `cours_enseignant_id_foreign` FOREIGN KEY (`enseignant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `devoirs`
--
ALTER TABLE `devoirs`
  ADD CONSTRAINT `devoirs_cours_id_foreign` FOREIGN KEY (`cours_id`) REFERENCES `cours` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_destinataire_id_foreign` FOREIGN KEY (`destinataire_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_expediteur_id_foreign` FOREIGN KEY (`expediteur_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_cours_id_foreign` FOREIGN KEY (`cours_id`) REFERENCES `cours` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_evaluateur_id_foreign` FOREIGN KEY (`evaluateur_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notes_soumission_id_foreign` FOREIGN KEY (`soumission_id`) REFERENCES `soumissions` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `profils`
--
ALTER TABLE `profils`
  ADD CONSTRAINT `profils_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `soumissions`
--
ALTER TABLE `soumissions`
  ADD CONSTRAINT `soumissions_devoir_id_foreign` FOREIGN KEY (`devoir_id`) REFERENCES `devoirs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `soumissions_etudiant_id_foreign` FOREIGN KEY (`etudiant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
