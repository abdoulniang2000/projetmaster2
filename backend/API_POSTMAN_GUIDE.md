# Guide d'Utilisation de l'API MasterCampus avec Postman

## 📋 Introduction

Ce guide vous explique comment importer et utiliser la collection Postman pour tester l'API MasterCampus.

## 🚀 Installation et Configuration

### 1. Importer la Collection Postman

1. Ouvrez Postman
2. Cliquez sur **Import** dans le coin supérieur gauche
3. Sélectionnez le fichier `postman-collection.json`
4. Choisissez **Import** pour ajouter la collection

### 2. Importer l'Environnement

1. Dans Postman, cliquez sur **Manage Environments** (icône en forme d'œil en haut à droite)
2. Cliquez sur **Import**
3. Sélectionnez le fichier `postman-environment.json`
4. Activez l'environnement "MasterCampus API Environment" dans le menu déroulant

### 3. Configuration de l'URL de Base

Par défaut, l'URL de base est configurée sur `http://localhost:8000`. 
Si votre serveur Laravel tourne sur un autre port, modifiez la variable `baseUrl` dans l'environnement.

## 🔐 Authentification

### Flow d'Authentification

1. **Créer un compte** : Utilisez `Register User`
2. **Se connecter** : Utilisez `Login` (le token sera automatiquement sauvegardé)
3. **Utiliser les endpoints protégés** : Le token sera automatiquement ajouté aux requêtes

### Variables Automatiques

- `authToken` : Généré automatiquement après login
- `user` : Informations utilisateur sauvegardées après login

## 📚 Structure des Endpoints

### 1. Authentication (`/api/v1/`)
- `POST /register` : Créer un compte
- `POST /login` : Se connecter
- `POST /logout` : Se déconnecter
- `GET /user` : Obtenir les infos utilisateur

### 2. System (`/api/v1/`)
- `GET /test` : Tester l'API
- `POST /login-simple` : Test de connexion simple
- `POST /login-minimal` : Test minimal de connexion

### 3. Users Management (`/api/v1/users`)
- `GET /users` : Lister tous les utilisateurs
- `POST /users` : Créer un utilisateur
- `GET /users/{id}` : Voir un utilisateur
- `PUT /users/{id}` : Mettre à jour un utilisateur
- `DELETE /users/{id}` : Supprimer un utilisateur

### 4. Educational Content
- **Modules** (`/api/v1/modules`) : Gestion des modules
- **Matières** (`/api/v1/matieres`) : Gestion des matières
- **Semestres** (`/api/v1/semestres`) : Gestion des semestres
- **Cours** (`/api/v1/cours`) : Gestion des cours

### 5. Analytics (`/api/v1/analytics`)
- `GET /dashboard` : Statistiques du dashboard

## 🎯 Cas d'Utilisation Typiques

### Scénario 1 : Étudiant

1. S'inscrire avec `Register User`
2. Se connecter avec `Login`
3. Accéder aux supports de cours
4. Voir les devoirs assignés
5. Soumettre des devoirs
6. Participer aux forums

### Scénario 2 : Enseignant

1. Se connecter avec `Login`
2. Créer des modules et cours
3. Ajouter des supports de cours
4. Créer et gérer des devoirs
5. Animer des forums

### Scénario 3 : Administrateur

1. Se connecter avec `Login`
2. Gérer les utilisateurs
3. Accéder aux analytics
4. Gérer les rôles
5. Créer des notifications

## 🔧 Personnalisation

### Modifier les Variables d'Environnement

1. Cliquez sur l'icône d'œil en haut à droite
2. Sélectionnez "MasterCampus API Environment"
3. Modifiez les valeurs selon vos besoins

### IDs de Test

Les variables suivantes sont pré-configurées pour les tests :
- `userId` : ID utilisateur par défaut
- `moduleId` : ID module par défaut
- `matiereId` : ID matière par défaut
- `semestreId` : ID semestre par défaut
- `coursId` : ID cours par défaut

## 🐛 Débogage

### Codes d'Erreur Communs

- **200** : Succès
- **201** : Créé avec succès
- **400** : Requête invalide
- **401** : Non authentifié
- **403** : Accès interdit
- **404** : Ressource non trouvée
- **422** : Erreur de validation
- **500** : Erreur serveur

### Logs

Les endpoints de test incluent des logs détaillés pour le débogage :
- `POST /api/v1/login-simple` : Logs de connexion
- `GET /api/v1/test` : Informations système

## 📝 Notes Importantes

1. **Authentification** : La plupart des endpoints de l'espace étudiant nécessitent un token valide
2. **Permissions** : Certains endpoints sont réservés à des rôles spécifiques (enseignant, admin)
3. **Variables** : Les IDs dans les requêtes utilisent les variables d'environnement
4. **Tests Automatiques** : Le login sauvegarde automatiquement le token pour les requêtes suivantes

## 🚀 Démarrage Rapide

1. Importez la collection et l'environnement
2. Lancez votre serveur Laravel (`php artisan serve`)
3. Testez avec `GET /api/v1/test` pour vérifier la connexion
4. Créez un compte avec `Register User`
5. Connectez-vous avec `Login`
6. Explorez les autres endpoints !

## 📞 Support

Pour toute question sur l'API ou la collection Postman, consultez les logs du serveur Laravel ou contactez l'équipe de développement.

---

**MasterCampus API** - Plateforme Éducative Intégrée
