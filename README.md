# Projet de Plateforme E-learning (LMS)

Ce projet est une application web complète de type LMS (Learning Management System) construite avec une architecture découplée : un backend en **Laravel 11** et un frontend en **Next.js 14**.

## Fonctionnalités

*   **Gestion des Rôles :** Administrateurs, Enseignants, Étudiants.
*   **Authentification :** Inscription et connexion sécurisées avec Laravel Sanctum.
*   **Gestion des Cours :** CRUD complet pour les cours (création, lecture, mise à jour, suppression).
*   **Gestion des Devoirs :** Les enseignants peuvent créer et assigner des devoirs avec des pièces jointes.
*   **Soumission des Devoirs :** Les étudiants peuvent soumettre leurs travaux en téléversant des fichiers.
*   **Notation :** Les enseignants peuvent noter les soumissions et laisser des commentaires.
*   **Messagerie Interne :** Communication en temps réel entre les utilisateurs.
*   **Notifications :** Système de notifications pour les événements importants (ex: devoir noté).

## Structure du Projet

```
/
├── app/                # Frontend Next.js
│   ├── (auth)/         # Groupe de routes pour l'authentification
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/      # Groupe de routes pour le tableau de bord
│   │   ├── admin/
│   │   ├── enseignant/
│   │   ├── etudiant/
│   │   ├── cours/
│   │   ├── devoirs/
│   │   └── ... (autres pages du dashboard)
│   ├── components/     # Composants React (avec shadcn/ui)
│   ├── contexts/       # Contexte React (AuthContext)
│   └── ...
├── backend/            # Backend Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   └── Policies/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
├── components/         # Composants shadcn/ui (racine)
├── lib/                # Utilitaires frontend (axios, shadcn)
└── ...
```

## Installation et Lancement

### Prérequis

*   PHP >= 8.2
*   Composer
*   Node.js >= 18.x
*   NPM
*   Une base de données (MySQL, PostgreSQL, etc.)

### 1. Configuration du Backend (Laravel)

1.  **Naviguez dans le dossier `backend` :**
    ```bash
    cd backend
    ```

2.  **Installez les dépendances PHP :**
    ```bash
    composer install
    ```

3.  **Configurez votre environnement :**
    *   Copiez le fichier `.env.example` en `.env`.
    *   Configurez les informations de votre base de données (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

4.  **Générez la clé d'application :**
    ```bash
    php artisan key:generate
    ```

5.  **Exécutez les migrations et les seeders :**
    *   Cela créera les tables et remplira la base de données avec des utilisateurs de test (admin, enseignant, étudiant).
    ```bash
    php artisan migrate --seed
    ```

6.  **Créez le lien de stockage :**
    ```bash
    php artisan storage:link
    ```

7.  **Lancez le serveur de développement Laravel :**
    ```bash
    php artisan serve
    ```
    Le backend sera accessible à l'adresse `http://localhost:8000`.

### 2. Configuration du Frontend (Next.js)

1.  **Naviguez à la racine du projet :**
    ```bash
    cd .. 
    ```

2.  **Installez les dépendances JavaScript :**
    ```bash
    npm install
    ```

3.  **Lancez le serveur de développement Next.js :**
    ```bash
    npm run dev
    ```
    Le frontend sera accessible à l'adresse `http://localhost:3000`.

## Utilisateurs de Test

Les utilisateurs suivants sont créés par les seeders :

*   **Administrateur :**
    *   Email : `admin@example.com`
    *   Mot de passe : `password`

*   **Enseignant :**
    *   Email : `enseignant@example.com`
    *   Mot de passe : `password`

*   **Étudiant :**
    *   Email : `etudiant@example.com`
    *   Mot de passe : `password`
