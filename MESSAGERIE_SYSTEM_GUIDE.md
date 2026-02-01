# Guide d'utilisation du système de messagerie interne

## Vue d'ensemble

Le système de messagerie interne permet une communication fluide entre les étudiants, enseignants et administrateurs avec des fonctionnalités avancées de gestion et de modération.

## Fonctionnalités principales

### 1. Messages privés étudiant ⇄ enseignant
- **Communication directe** : Les étudiants peuvent envoyer des messages privés à leurs enseignants
- **Discussions structurées** : Les conversations sont organisées par threads
- **Notifications en temps réel** : Alertes pour les nouveaux messages

### 2. Groupes par matière
- **Conversations de matière** : Chaque matière peut avoir sa propre conversation de groupe
- **Accès automatique** : Les étudiants inscrits à une matière sont automatiquement ajoutés
- **Gestion par l'enseignant** : Les enseignants peuvent modérer et gérer les conversations de matière

### 3. Système de tags
- **Tags prédéfinis** : #urgent, #annonce, #projet, #information, #question, #reunion, #devoir, #examen
- **Couleurs associées** : Chaque tag a une couleur spécifique pour un identification visuelle rapide
- **Filtrage par tag** : Possibilité de filtrer les messages par tag
- **Tags personnalisés** : Les utilisateurs peuvent créer leurs propres tags

## Accès à la messagerie

### Étudiants
- URL : `/dashboard/messagerie`
- Accès aux conversations privées avec les enseignants
- Participation aux conversations de matière
- Création de conversations privées

### Enseignants
- URL : `/dashboard/messagerie/enseignant`
- Accès complet à toutes les fonctionnalités
- Création de conversations de matière
- Statistiques d'engagement des étudiants
- Gestion des conversations

### Administrateurs
- URL : `/dashboard/messagerie/admin`
- Accès administratif complet
- Panneau de modération
- Statistiques système
- Gestion des utilisateurs et conversations
- Export de données

## Types de conversations

### 1. Conversations privées
- **Participants** : 2 personnes (étudiant ↔ enseignant)
- **Utilisation** : Questions personnelles, demandes spécifiques
- **Confidentialité** : Uniquement visible par les participants

### 2. Conversations de groupe
- **Participants** : Plusieurs utilisateurs
- **Utilisation** : Projets d'équipe, discussions thématiques
- **Gestion** : Créé par n'importe quel utilisateur

### 3. Conversations de matière
- **Participants** : Tous les étudiants inscrits + enseignant
- **Utilisation** : Annonces de cours, discussions générales
- **Gestion** : Contrôlée par l'enseignant de la matière

## Utilisation des tags

### Tags prédéfinis avec couleurs :
- **#urgent** (Rouge) : Messages urgents nécessitant une attention immédiate
- **#annonce** (Bleu) : Annonces officielles et informations importantes
- **#projet** (Vert) : Discussions relatives aux projets
- **#information** (Gris) : Partage d'informations générales
- **#question** (Orange) : Questions et demandes d'éclaircissement
- **#reunion** (Violet) : Organisation de réunions
- **#devoir** (Rose) : Discussions sur les devoirs
- **#examen** (Cyan) : Informations sur les examens

### Comment utiliser les tags :
1. **Dans le message** : Tapez `#tag` directement dans votre message
2. **Tags rapides** : Cliquez sur les tags prédéfinis sous la zone de saisie
3. **Tags personnalisés** : Créez vos propres tags en commençant par `#`

## Fonctionnalités de modération (Admin)

### Panneau de modération
- **Messages signalés** : Vue des messages rapportés par les utilisateurs
- **Actions rapides** : Bannissement d'utilisateurs, suppression de messages
- **Export de données** : Exportation des conversations et messages

### Gestion des conversations
- **Suppression** : Suppression complète de conversations
- **Archivage** : Archivage des conversations inactives
- **Statistiques** : Vue d'ensemble de l'activité du système

## Bonnes pratiques

### Pour les étudiants
1. **Soyez clairs et concis** dans vos messages
2. **Utilisez les tags appropriés** pour organiser la communication
3. **Respectez les heures de travail** des enseignants
4. **Vérifiez les conversations de matière** avant de poser des questions générales

### Pour les enseignants
1. **Créez des conversations de matière** pour chaque cours
2. **Utilisez #annonce** pour les communications officielles
3. **Répondez rapidement** aux messages marqués #urgent
4. **Archivez** les conversations inactives pour maintenir l'organisation

### Pour les administrateurs
1. **Surveillez les signalements** régulièrement
2. **Exportez les données** périodiquement pour sauvegarde
3. **Gérez les utilisateurs** problématiques rapidement
4. **Maintenez les statistiques** à jour pour le suivi

## Dépannage

### Problèmes courants
1. **Messages non reçus** : Vérifiez votre connexion internet
2. **Conversation non visible** : Assurez-vous d'être bien participant
3. **Tags non fonctionnels** : Vérifiez que le tag commence par `#`
4. **Accès refusé** : Vérifiez vos permissions de rôle

### Support technique
- Pour les problèmes techniques, contactez l'administrateur système
- Pour les questions d'utilisation, consultez ce guide ou votre superviseur

## Sécurité et confidentialité

- **Chiffrement** : Tous les messages sont chiffrés
- **Confidentialité** : Les conversations privées ne sont visibles que par les participants
- **Modération** : Les administrateurs peuvent modérer le contenu si nécessaire
- **Journalisation** : Toutes les actions sont enregistrées pour la sécurité

## Évolutions futures

- **Notifications push** sur mobile
- **Appels vidéo** intégrés
- **Partage de fichiers** avancé
- **Intégration calendrier**
- **Traduction automatique**
- **Assistant IA** pour les réponses
