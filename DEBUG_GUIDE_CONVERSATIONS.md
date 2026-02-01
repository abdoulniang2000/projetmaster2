# Guide de Débogage - Logs des Nouvelles Conversations

## 📋 Vue d'ensemble

Ce guide explique comment utiliser les logs détaillés ajoutés pour le débogage de la création de conversations et la gestion des participants.

## 🗂️ Emplacement des Logs

Les logs sont écrits dans le fichier :
```
backend/storage/logs/laravel.log
```

## 🔍 Types de Logs Disponibles

### 1. Logs de Niveau INFO
- **Début/Fin de création** : Suivi complet du processus
- **Validation réussie** : Confirmation des données valides
- **Transactions DB** : Suivi des opérations base de données
- **Ajout participants** : Confirmation des ajouts réussis

### 2. Logs de Niveau WARNING
- **Validation échouée** : Erreurs de validation des données
- **Tentatives non autorisées** : Accès refusé
- **Participants dupliqués** : Tentatives d'ajout de participants existants

### 3. Logs de Niveau ERROR
- **Exceptions critiques** : Erreurs système avec stack trace
- **Échecs transactions** : Rollbacks base de données
- **Erreurs inattendues** : Problèmes techniques

## 📊 Exemples de Logs et Leur Signification

### ✅ Création réussie
```
[2025-02-01 13:30:15] local.INFO: === DÉBUT CRÉATION CONVERSATION === 
{
    "user_id": 1,
    "user_email": "admin@example.com",
    "request_data": {
        "titre": "Discussion Projet",
        "type": "groupe",
        "participants": [2, 3]
    },
    "timestamp": "2025-02-01 13:30:15"
}

[2025-02-01 13:30:16] local.INFO: === CONVERSATION CRÉÉE AVEC SUCCÈS === 
{
    "conversation_id": 42,
    "user_id": 1,
    "type": "groupe",
    "participants_count": 3,
    "timestamp": "2025-02-01 13:30:16"
}
```

### ⚠️ Erreur de validation
```
[2025-02-01 13:31:20] local.WARNING: Validation échouée pour création conversation 
{
    "user_id": 1,
    "errors": {
        "titre": ["Le titre est obligatoire"],
        "participants": ["Au moins un participant est requis"]
    },
    "request_data": {
        "titre": "",
        "type": "groupe",
        "participants": []
    }
}
```

### ❌ Erreur système
```
[2025-02-01 13:32:25] local.ERROR: === ERREUR CRÉATION CONVERSATION === 
{
    "error_message": "SQLSTATE[23000]: Integrity constraint violation",
    "error_code": 23000,
    "error_file": "/app/Models/Conversation.php",
    "error_line": 110,
    "user_id": 1,
    "request_data": {...},
    "timestamp": "2025-02-01 13:32:25"
}
```

## 🔧 Commandes Utiles pour le Débogage

### 1. Voir les logs en temps réel
```bash
tail -f backend/storage/logs/laravel.log
```

### 2. Filtrer les logs de conversation
```bash
grep "CONVERSATION" backend/storage/logs/laravel.log
```

### 3. Voir les erreurs uniquement
```bash
grep "ERROR" backend/storage/logs/laravel.log | grep "CONVERSATION"
```

### 4. Filtrer par utilisateur spécifique
```bash
grep "user_id\":1" backend/storage/logs/laravel.log
```

### 5. Voir les dernières 100 lignes
```bash
tail -n 100 backend/storage/logs/laravel.log
```

## 🎯 Points de Contrôle Clés

### 1. Authentification
Vérifiez ces logs pour confirmer que l'utilisateur est bien authentifié :
```
Utilisateur authentifié
Tentative de création de conversation non authentifiée
```

### 2. Validation
Les erreurs de validation apparaissent avec :
```
Validation échouée pour création conversation
Conversation matière sans cours_id
Conversation privée avec nombre de participants incorrect
```

### 3. Base de Données
Surveillez les opérations DB :
```
Début transaction DB - Création conversation
Conversation créée avec succès
Participant ajouté avec succès
Transaction DB validée avec succès
```

### 4. Rôles et Permissions
Vérifiez l'attribution des rôles :
```
Détermination rôle participant
Rôle modérateur attribué (enseignant du cours)
Rôle admin attribué (admin système)
```

## 🐛 Problèmes Communs et Solutions

### Problème 1 : "Non authentifié"
**Logs possibles :**
```
Tentative de création de conversation non authentifiée
```

**Solutions :**
- Vérifiez le token d'authentification
- Confirmez que l'utilisateur est connecté
- Vérifiez les middleware d'authentification

### Problème 2 : Validation échouée
**Logs possibles :**
```
Validation échouée pour création conversation
```

**Solutions :**
- Vérifiez les champs requis dans la requête
- Confirmez les formats des données
- Vérifiez l'existence des IDs (utilisateurs, cours)

### Problème 3 : Erreur de base de données
**Logs possibles :**
```
Erreur lors de l'ajout du participant
Erreur création message de bienvenue
```

**Solutions :**
- Vérifiez les connexions base de données
- Confirmez la structure des tables
- Vérifiez les contraintes d'intégrité

### Problème 4 : Rôles incorrects
**Logs possibles :**
```
Utilisateur non trouvé pour attribution rôle
```

**Solutions :**
- Vérifiez que les utilisateurs existent
- Confirmez la configuration des rôles
- Vérifiez les permissions

## 📈 Monitoring et Alertes

### 1. Surveillance en temps réel
```bash
# Surveillance continue avec filtre
tail -f backend/storage/logs/laravel.log | grep "CONVERSATION"
```

### 2. Compter les erreurs
```bash
# Nombre d'erreurs de conversation aujourd'hui
grep "$(date '+%Y-%m-%d')" backend/storage/logs/laravel.log | grep "ERROR.*CONVERSATION" | wc -l
```

### 3. Exporter les logs d'erreur
```bash
# Extraire les erreurs de conversation dans un fichier
grep "ERROR.*CONVERSATION" backend/storage/logs/laravel.log > conversation_errors.log
```

## 🛠️ Configuration Avancée

### 1. Niveau de log personnalisé
Dans `config/logging.php`, vous pouvez ajuster les niveaux :
```php
'channels' => [
    'conversation' => [
        'driver' => 'single',
        'path' => storage_path('logs/conversation.log'),
        'level' => 'debug',
        'replace_placeholders' => true,
    ],
],
```

### 2. Rotation des logs
Pour éviter que les fichiers ne deviennent trop gros :
```bash
# Configurer logrotate
sudo nano /etc/logrotate.d/laravel
```

## 📝 Checklist de Débogage

Quand une conversation échoue :

1. **Vérifier l'authentification**
   - [ ] Utilisateur authentifié ?
   - [ ] Token valide ?

2. **Vérifier la validation**
   - [ ] Tous les champs requis présents ?
   - [ ] Formats corrects ?
   - [ ] IDs valides ?

3. **Vérifier la base de données**
   - [ ] Connexion établie ?
   - [ ] Tables existantes ?
   - [ ] Contraintes respectées ?

4. **Vérifier les permissions**
   - [ ] Droits suffisants ?
   - [ ] Rôles corrects ?

5. **Analyser les logs**
   - [ ] Messages d'erreur ?
   - [ ] Stack trace complète ?
   - [ ] Contexte disponible ?

---

**Pour obtenir de l'aide :**
1. Collectez les logs pertinents
2. Identifiez le message d'erreur exact
3. Notez le contexte (utilisateur, timestamp, requête)
4. Contactez l'équipe de développement avec ces informations
