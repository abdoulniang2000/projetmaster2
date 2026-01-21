# Guide de Débogage pour la Création d'Utilisateur

## Problème
Vous ne parvenez pas à créer un utilisateur dans votre application Laravel.

## Étapes de Diagnostic

### 1. Vérification de la Base de Données

#### Via phpMyAdmin
1. Ouvrez phpMyAdmin
2. Sélectionnez votre base de données (probablement `mastercampus`)
3. Vérifiez que les tables suivantes existent :
   - `users` (table principale des utilisateurs)
   - `roles` (table des rôles)
   - `role_user` (table de liaison entre utilisateurs et rôles)

#### Structure de la table `users`
La table `users` devrait contenir ces colonnes :
- `id` (INT, auto-increment)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR) 
- `username` (VARCHAR, unique)
- `email` (VARCHAR, unique)
- `password` (VARCHAR)
- `status` (BOOLEAN, default: 1)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. Création Manuelle via phpMyAdmin

1. Allez dans la table `users`
2. Cliquez sur l'onglet "Insérer"
3. Remplissez les champs :
   ```
   first_name: Test
   last_name: User
   username: test.user
   email: test@example.com
   password: $2y$10$abcdefghijklmnopqrstuvABCDEF (hash du mot de passe)
   status: 1
   created_at: 2025-01-20 10:00:00
   updated_at: 2025-01-20 10:00:00
   ```
4. Cliquez sur "Exécuter"

### 3. Génération du Hash du Mot de Passe

Pour générer un hash de mot de passe valide :
```php
<?php
echo password_hash('votre_mot_de_passe', PASSWORD_DEFAULT);
?>
```

### 4. Attribution d'un Rôle

1. Allez dans la table `role_user`
2. Cliquez sur "Insérer"
3. Entrez :
   ```
   user_id: [ID de l'utilisateur créé]
   role_id: [ID du rôle, généralement 3 pour 'etudiant']
   ```

### 5. Scripts de Test

J'ai créé plusieurs scripts pour vous aider :

#### `test_db_connection.php`
Teste la connexion à la base de données et crée un utilisateur de test.

#### `create_user_sql.php`
Crée un utilisateur en utilisant SQL direct.

#### `create_user_simple.php`
Version simplifiée sans dépendances Laravel.

### 6. Vérification de l'Application

#### Vérifier les migrations
```bash
cd backend
php artisan migrate:status
```

#### Exécuter les seeders
```bash
cd backend
php artisan db:seed --class=RoleAndPermissionSeeder
php artisan db:seed --class=UserSeeder
```

### 7. Test de l'API

Pour tester la création via l'API :
```bash
curl -X POST http://localhost:8000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User", 
    "username": "test.user",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Solutions Possibles

### Si les tables n'existent pas
```bash
cd backend
php artisan migrate
```

### Si les rôles n'existent pas
```bash
cd backend
php artisan db:seed --class=RoleAndPermissionSeeder
```

### Si l'API ne fonctionne pas
1. Vérifiez que le serveur Laravel est démarré :
   ```bash
   cd backend
   php artisan serve
   ```
2. Vérifiez les logs Laravel dans `backend/storage/logs/laravel.log`

### Si phpMyAdmin ne fonctionne pas
1. Vérifiez que MySQL/WAMP/XAMPP est démarré
2. Vérifiez les identifiants de connexion à la base de données

## Étapes Suivantes

1. Exécutez `php test_db_connection.php` pour diagnostiquer
2. Si la connexion échoue, vérifiez votre configuration MySQL
3. Si la connexion réussit, utilisez phpMyAdmin pour créer un utilisateur manuellement
4. Testez la connexion avec cet utilisateur dans votre application

## Contact

Si vous avez toujours des problèmes, vérifiez :
- Les logs d'erreurs de Laravel
- Les logs d'erreurs de votre serveur web
- La configuration de votre base de données dans `.env`
