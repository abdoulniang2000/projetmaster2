# 🗄️ Configuration de la Sauvegarde des Utilisateurs

## 📋 Étapes à Suivre

### 1. **Exécuter la Migration**
```bash
cd backend
php artisan migrate
```

Cette commande va:
- ✅ Ajouter les champs `department` et `student_id` à la table `users`
- ✅ Mettre à jour la structure de la base de données

### 2. **Vérifier la Structure de la Table**
```bash
php artisan tinker
>>> \Schema::getColumnListing('users');
>>> \DB::select('DESCRIBE users');
```

### 3. **Vérifier les Rôles Disponibles**
```bash
php artisan tinker
>>> \App\Models\Role::all();
```

Si aucun rôle n'existe, en créer:
```bash
php artisan tinker
>>> \App\Models\Role::create(['name' => 'etudiant', 'description' => 'Étudiant']);
>>> \App\Models\Role::create(['name' => 'enseignant', 'description' => 'Enseignant']);
>>> \App\Models\Role::create(['name' => 'admin', 'description' => 'Administrateur']);
```

### 4. **Tester la Création d'Utilisateur**
```bash
php artisan tinker
>>> $user = \App\Models\User::create([
...     'first_name' => 'Test',
...     'last_name' => 'User',
...     'email' => 'test@example.com',
...     'password' => Hash::make('password123'),
...     'department' => 'Informatique',
...     'student_id' => '2024001'
... ]);
>>> $user->roles()->attach(\App\Models\Role::where('name', 'etudiant')->first());
>>> $user->load('roles');
```

### 5. **Démarrer le Serveur**
```bash
php artisan serve --port=8001 --host=0.0.0.0
```

## 🔍 Vérification

### Vérifier les Logs Laravel
```bash
tail -f storage/logs/laravel.log
```

### Vérifier la Base de Données
```sql
-- Vérifier les utilisateurs
SELECT * FROM users;

-- Vérifier les rôles assignés
SELECT u.*, r.name as role_name 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id;
```

## 🚀 Test Final

1. **Ouvrir le frontend**: http://localhost:3000
2. **Se connecter** en tant qu'admin
3. **Aller à**: `/dashboard/admin/users`
4. **Cliquer sur**: "Ajouter un utilisateur"
5. **Remplir le formulaire** et soumettre
6. **Vérifier**:
   - ✅ Toast de succès
   - ✅ Utilisateur apparaît dans la liste
   - ✅ Utilisateur enregistré en base

## 🐛 Dépannage

### Si la migration échoue:
```bash
php artisan migrate:rollback
php artisan migrate
```

### Si les rôles n'existent pas:
```bash
php artisan db:seed --class=RoleSeeder
```

### Si l'utilisateur n'est pas sauvegardé:
1. Vérifier les logs Laravel
2. Vérifier la console du navigateur
3. Tester avec Postman ou curl

## 📊 Structure Attendue

Après configuration, la table `users` devrait contenir:
- `id`, `first_name`, `last_name`, `username`, `email`
- `password`, `phone`, `address`, `city`, `country`
- `postal_code`, `department`, `student_id`
- `about`, `avatar`, `status`, `last_login_at`, `last_login_ip`
- `email_verified_at`, `remember_token`, `created_at`, `updated_at`

Et la table `user_roles` devrait contenir les associations utilisateurs-rôles.
