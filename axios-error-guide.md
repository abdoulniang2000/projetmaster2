# 🔧 Guide de Résolution des Erreurs Axios

## 🚨 Erreur: "Erreur lors de l'ajout de l'utilisateur: AxiosError"

### 📋 **Causes Possibles et Solutions**

---

## 🔍 **1. Backend Non Démarré**

**Symptômes:**
- `ERR_NETWORK` ou `ECONNREFUSED`
- Message: "Impossible de se connecter au serveur"

**Solution:**
```bash
cd backend
php artisan serve --port=8001 --host=0.0.0.0
```

**Vérification:**
- Ouvrir http://127.0.0.1:8001 dans le navigateur
- Devrait afficher la page Laravel par défaut

---

## 🗄️ **2. Migration Non Exécutée**

**Symptômes:**
- Erreur 500 avec "Column not found"
- Champs `department` ou `student_id` manquants

**Solution:**
```bash
cd backend
php artisan migrate
```

**Vérification:**
```bash
php artisan tinker
>>> \Schema::getColumnListing('users');
```

---

## 🎭 **3. Rôles Non Créés**

**Symptômes:**
- Erreur 422: "The selected role is invalid"
- Constraint violation sur la table roles

**Solution:**
```bash
php artisan tinker
>>> \App\Models\Role::create(['name' => 'etudiant']);
>>> \App\Models\Role::create(['name' => 'enseignant']);
>>> \App\Models\Role::create(['name' => 'admin']);
```

---

## 🔐 **4. Problème d'Authentification**

**Symptômes:**
- Erreur 401: "Unauthenticated"
- Token manquant ou invalide

**Solution:**
1. **Se déconnecter et se reconnecter**
2. **Vérifier le token dans localStorage:**
   ```javascript
   localStorage.getItem('auth_token')
   ```

---

## 🌐 **5. Problème CORS**

**Symptômes:**
- Erreur CORS dans la console
- Requête bloquée par le navigateur

**Solution:**
```bash
cd backend
php artisan config:cache
```

Vérifier `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000'],
```

---

## 🧪 **Diagnostic Rapide**

### Étape 1: Console Navigateur
Ouvrez F12 et regardez les logs:
- `=== AXIOS ERROR INTERCEPTOR ===` = détails de l'erreur
- `Erreur lors de l'ajout de l'utilisateur` = erreur catchée

### Étape 2: Test Manuel
1. **Ouvrir la console** (F12)
2. **Coller et exécuter** le contenu de `diagnostic-backend.js`

### Étape 3: Vérification Backend
```bash
# Test l'API directement
curl http://127.0.0.1:8001/api/v1/test

# Test création utilisateur
curl -X POST http://127.0.0.1:8001/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@test.com","password":"password123","role":"etudiant"}'
```

---

## 📊 **Messages d'Erreur Spécifiques**

| Message | Cause | Solution |
|---------|-------|----------|
| `ERR_NETWORK` | Backend arrêté | `php artisan serve` |
| `ECONNREFUSED` | Port incorrect | Vérifier port 8001 |
| `422 Validation` | Données invalides | Vérifier champs requis |
| `403 Forbidden` | Permissions | Vérifier policies |
| `500 Server Error` | Erreur PHP | Vérifier logs Laravel |

---

## 🚀 **Checklist de Dépannage**

- [ ] Backend démarré sur port 8001
- [ ] Base de données connectée
- [ ] Migrations exécutées
- [ ] Rôles créés
- [ ] Utilisateur connecté (token présent)
- [ ] CORS configuré
- [ ] Logs Laravel consultés

---

## 📞 **Si le Problème Persiste**

1. **Copiez les logs complets** de la console
2. **Vérifiez les logs Laravel**: `tail -f storage/logs/laravel.log`
3. **Testez avec Postman** ou curl
4. **Redémarrez tout** (backend + frontend)

---

## 🎯 **Test Final**

Une fois corrigé:
1. ✅ Plus d'erreur dans la console
2. ✅ Toast de succès s'affiche
3. ✅ Utilisateur apparaît dans la liste
4. ✅ Utilisateur enregistré en base

Le formulaire devrait fonctionner parfaitement! 🚀
