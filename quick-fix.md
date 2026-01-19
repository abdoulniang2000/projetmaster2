# 🚨 Erreur 500 - Solution Rapide

## 🔍 **Problème: Internal Server Error (500)**

L'erreur 500 signifie que le backend Laravel a une erreur interne. Voici les causes les plus probables et leurs solutions:

---

## 🗄️ **Cause #1: Migrations Non Exécutées (80% des cas)**

### **Symptômes:**
- Erreur 500 sur création d'utilisateur
- Logs mentionnent "Column not found"

### **Solution:**
```bash
cd backend
php artisan migrate
```

### **Vérification:**
```bash
php artisan tinker
>>> \Schema::getColumnListing('users');
```

---

## 🎭 **Cause #2: Rôles Manquants**

### **Symptômes:**
- Erreur 500 avec "constraint violation"
- Erreur sur la table `roles` ou `user_roles`

### **Solution:**
```bash
php artisan tinker
>>> \App\Models\Role::create(['name' => 'etudiant', 'description' => 'Étudiant']);
>>> \App\Models\Role::create(['name' => 'enseignant', 'description' => 'Enseignant']);
>>> \App\Models\Role::create(['name' => 'admin', 'description' => 'Administrateur']);
```

---

## 🔌 **Cause #3: Base de Données Non Connectée**

### **Symptômes:**
- Erreur 500 avec "Connection refused"
- Logs mentionnent "SQLSTATE[HY000]"

### **Solution:**
1. **Démarrer MySQL/MariaDB**
2. **Vérifier .env:**
   ```bash
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=laravel
   DB_USERNAME=root
   DB_PASSWORD=
   ```

---

## 📁 **Cause #4: Permissions Storage**

### **Symptômes:**
- Erreur 500 avec "Permission denied"
- Impossible d'écrire dans les logs

### **Solution:**
```bash
cd backend
php artisan storage:link
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

---

## 🧪 **Test de Diagnostic Immédiat**

### **Étape 1: Vérifier si le backend fonctionne**
```bash
curl http://127.0.0.1:8001/api/v1/test
```

### **Étape 2: Tester la création d'utilisateur**
```bash
curl -X POST http://127.0.0.1:8001/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@test.com","password":"password123","role":"etudiant"}'
```

### **Étape 3: Vérifier les logs Laravel**
```bash
cd backend
tail -f storage/logs/laravel.log
```

---

## 🎯 **Plan d'Action Recommandé**

### **1. Exécuter les commandes dans l'ordre:**
```bash
# 1. Nettoyer les caches
cd backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# 2. Exécuter les migrations
php artisan migrate

# 3. Créer les rôles si nécessaires
php artisan tinker
>>> \App\Models\Role::all();

# 4. Redémarrer le serveur
php artisan serve --port=8001 --host=0.0.0.0
```

### **2. Tester le formulaire:**
- Allez sur `/dashboard/admin/users`
- Essayez de créer un utilisateur
- Regardez la console pour les messages détaillés

---

## 📊 **Messages d'Erreur Spécifiques**

| Message dans la console | Cause | Solution |
|------------------------|--------|----------|
| `Column not found: department` | Migration manquante | `php artisan migrate` |
| `Connection refused` | Base arrêtée | Démarrer MySQL |
| `Constraint violation` | Rôle manquant | Créer les rôles |
| `Permission denied` | Storage inaccessible | `chmod -R 755 storage` |

---

## ✅ **Vérification Finale**

Une fois corrigé, vous devriez voir:
- ✅ Plus d'erreur 500
- ✅ Toast de succès
- ✅ Utilisateur créé dans la base
- ✅ Utilisateur apparaît dans la liste

---

## 🚨 **Si Rien ne Fonctionne**

1. **Copiez les logs Laravel** complets
2. **Vérifiez la version PHP** (`php -v`)
3. **Réinstallez les dépendances** (`composer install`)
4. **Redémarrez tout** (backend + frontend)

Le problème 500 est généralement facile à résoudre avec ces étapes! 🚀
