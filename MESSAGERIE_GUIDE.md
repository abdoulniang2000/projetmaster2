# 💬 Guide du Module de Messagerie Interne

Ce guide présente le module de messagerie interne complet avec toutes ses fonctionnalités.

## 🎯 Fonctionnalités Principales

### 1. **Messages Privés Étudiant ⇄ Enseignant**
- Conversations individuelles entre étudiants et enseignants
- Interface de messagerie temps réel
- Historique complet des conversations
- Notifications pour les nouveaux messages

### 2. **Groupes par Matière**
- Conversations de groupe liées à chaque matière
- Accès automatique pour les étudiants inscrits
- Modération par les enseignants
- Partage de ressources spécifiques à la matière

### 3. **Système de Tags**
- Tags prédéfinis : `#urgent`, `#annonce`, `#projet`, `#information`, `#question`, `#reunion`, `#devoir`, `#examen`
- Tags personnalisés possibles
- Couleurs associées aux tags pour un visuel clair
- Filtrage des messages par tags

## 🏗️ Architecture Technique

### Base de Données

#### Tables Principales
- **`conversations`** : Informations sur les conversations
- **`conversation_participants`** : Participants et leurs rôles
- **`messages`** : Messages envoyés dans les conversations
- **`message_tags`** : Tags associés aux messages

#### Types de Conversations
- **`prive`** : Conversation entre deux personnes
- **`groupe`** : Groupe de discussion avec plusieurs participants
- **`matiere`** : Conversation liée à une matière spécifique

#### Rôles des Participants
- **`admin`** : Peut gérer la conversation (ajouter/supprimer participants)
- **`moderateur`** : Peut modérer les messages (enseignants dans les conversations de matière)
- **`membre`** : Peut lire et écrire des messages

### API Endpoints

#### Conversations
```
GET    /api/conversations                    # Lister les conversations
GET    /api/conversations/par-cours          # Conversations groupées par cours
POST   /api/conversations                    # Créer une conversation
GET    /api/conversations/{id}               # Voir une conversation
PUT    /api/conversations/{id}               # Modifier une conversation
DELETE /api/conversations/{id}               # Supprimer une conversation
POST   /api/conversations/{id}/participants  # Ajouter un participant
DELETE /api/conversations/{id}/participants  # Retirer un participant
PUT    /api/conversations/{id}/marquer-lue    # Marquer comme lue
```

#### Messages
```
GET    /api/messages/conversations/{id}      # Messages d'une conversation
POST   /api/messages/conversations/{id}      # Envoyer un message
GET    /api/messages/{id}                     # Voir un message
PUT    /api/messages/{id}                     # Modifier un message
DELETE /api/messages/{id}                     # Supprimer un message
POST   /api/messages/{id}/tags               # Ajouter un tag
DELETE /api/messages/{id}/tags               # Supprimer un tag
GET    /api/messages/tags                    # Lister les tags disponibles
GET    /api/messages/par-tag                # Messages par tag
GET    /api/messages/{id}/telecharger        # Télécharger un fichier
```

## 🎨 Interface Utilisateur

### Page Principale (`/dashboard/messagerie`)
- **Liste des conversations** à gauche avec indicateurs de messages non lus
- **Zone de conversation** à droite avec l'historique des messages
- **Barre de recherche** et filtres par type
- **Modes d'affichage** : Liste ou groupé par matière

### Création de Conversation
- **Assistant en 2 étapes** : Informations → Participants
- **Sélection du type** : Privée, Groupe, ou Matière
- **Recherche d'utilisateurs** avec suggestions
- **Gestion des permissions** selon les rôles

### Gestion des Messages
- **Envoi de messages** texte, fichiers, liens
- **Tags intelligents** avec suggestions automatiques
- **Édition des messages** (15 minutes après envoi)
- **Suppression** avec confirmation

### Système de Tags
- **Tags prédéfinis** avec couleurs spécifiques
- **Interface de sélection** intuitive
- **Filtrage rapide** par tag
- **Recherche** de tags disponibles

## 🎯 Tags Prédéfinis

### Tags et Couleurs
| Tag | Couleur | Usage |
|-----|---------|-------|
| `#urgent` | 🔴 Rouge | Messages urgents nécessitant une attention immédiate |
| `#annonce` | 🔵 Bleu | Annonces officielles et informations importantes |
| `#projet` | 🟢 Vert | Discussions relatives aux projets |
| `#information` | ⚫ Gris | Informations générales |
| `#question` | 🟠 Orange | Questions et demandes d'aide |
| `#reunion` | 🟣 Violet | Organisation de réunions |
| `#devoir` | 🌷 Rose | Discussions sur les devoirs |
| `#examen` | 🩦 Cyan | Préparation aux examens |

### Utilisation des Tags
- **Ajout automatique** lors de la création de messages
- **Filtrage** des conversations par tag
- **Recherche** de messages par tag
- **Priorisation** visuelle selon les tags

## 🔐 Sécurité et Permissions

### Contrôle d'Accès
- **Authentification requise** pour toutes les fonctionnalités
- **Vérification des permissions** selon le rôle dans la conversation
- **Isolation des données** : chaque utilisateur ne voit que ses conversations

### Règles Métier
- **Étudiants** peuvent créer des conversations privées avec les enseignants
- **Enseignants** sont automatiquement modérateurs dans les conversations de matière
- **Admins** peuvent gérer toutes les conversations
- **Messages éditables** uniquement dans les 15 minutes après envoi

## 📱 Fonctionnalités Avancées

### Notifications
- **Notifications en temps réel** pour les nouveaux messages
- **Indicateurs de messages non lus** dans la sidebar
- **Compteurs** par conversation
- **Marquage automatique** comme lu lors de l'ouverture

### Recherche et Filtres
- **Recherche textuelle** dans les conversations
- **Filtres par type** de conversation
- **Filtres par statut** (lu/non lu)
- **Recherche par tags**

### Gestion des Fichiers
- **Upload de fichiers** jusqu'à 10MB
- **Support des formats** : PDF, images, documents
- **Téléchargement sécurisé** avec vérification des permissions
- **Aperçu des fichiers** dans l'interface

## 🚀 Performance et Optimisation

### Optimisations
- **Pagination** des messages (50 par page)
- **Chargement lazy** des conversations
- **Mise en cache** des conversations récentes
- **Compression** des fichiers uploadés

### Bonnes Pratiques
- **Limitation** du nombre de messages par conversation
- **Nettoyage automatique** des anciennes conversations archivées
- **Monitoring** des performances
- **Sauvegarde régulière** des données

## 📊 Statistiques et Monitoring

### Métriques Disponibles
- **Nombre de conversations** par type
- **Messages envoyés** par période
- **Tags les plus utilisés**
- **Temps de réponse** moyen
- **Taux d'engagement** des utilisateurs

### Rapports
- **Activité par matière**
- **Participation des étudiants**
- **Efficacité de la communication**
- **Utilisation des tags**

## 🔧 Personnalisation

### Configuration
- **Tags personnalisés** possibles
- **Couleurs personnalisables** pour les tags
- **Notifications configurables**
- **Thèmes adaptables**

### Extensions Possibles
- **Intégration avec email**
- **Notifications push mobile**
- **Intégration avec calendrier**
- **Traductions multilingues**

## 📚 Documentation Technique

### Modèles Laravel
```php
// Conversation
Conversation::create([
    'titre' => 'Titre de la conversation',
    'type' => 'prive|groupe|matiere',
    'cours_id' => 1, // optionnel
    'createur_id' => auth()->id()
]);

// Message
Message::create([
    'conversation_id' => $conversation->id,
    'expediteur_id' => auth()->id(),
    'contenu' => 'Contenu du message',
    'type' => 'texte|fichier|image|lien'
]);

// Tag
MessageTag::create([
    'message_id' => $message->id,
    'tag' => '#urgent',
    'couleur' => '#ef4444'
]);
```

### Exemples d'Utilisation
```javascript
// Frontend - Créer une conversation
const response = await axios.post('/api/conversations', {
    titre: 'Discussion projet',
    type: 'groupe',
    participants: [1, 2, 3]
});

// Frontend - Envoyer un message avec tag
await axios.post(`/api/messages/conversations/${conversationId}`, {
    contenu: 'Message important',
    type: 'texte',
    tags: ['#urgent']
});
```

## 🎯 Cas d'Usage

### Scénario 1 : Étudiant ↔ Enseignant
1. L'étudiant crée une conversation privée avec l'enseignant
2. Il pose une question sur un devoir
3. L'enseignant répond avec un fichier joint
4. La conversation est marquée comme résolue

### Scénario 2 : Groupe de Projet
1. Un enseignant crée un groupe de discussion pour un projet
2. Les étudiants sont ajoutés automatiquement
3. Les étudiants échangent des ressources avec des tags `#projet`
4. L'enseignant modère et guide la discussion

### Scénario 3 : Conversation de Matière
1. Une conversation est créée automatiquement pour chaque matière
2. Les enseignants postent des annonces avec `#annonce`
3. Les étudiants posent des questions avec `#question`
4. Les ressources importantes sont partagées avec `#information`

---

Ce module de messagerie offre une solution complète et moderne pour la communication interne, adaptée aux besoins spécifiques de l'environnement éducatif.
