# Guide de création de semestres et matières

## Problèmes identifiés et corrigés

### 1. Problème de validation dans MatiereController
- **Avant** : Le contrôleur validait `departement` (string) mais le modèle utilisait `departement_id` (foreign key)
- **Après** : Correction pour utiliser `departement_id` avec validation `exists:departements,id`

### 2. Manque du contrôleur DepartementController
- **Créé** : Nouveau contrôleur pour gérer les départements
- **Ajouté** : Route API pour les départements

## Endpoints API disponibles

### Départements
- `GET /api/v1/departements` - Lister tous les départements
- `POST /api/v1/departements` - Créer un département
- `GET /api/v1/departements/{id}` - Voir un département
- `PUT /api/v1/departements/{id}` - Modifier un département
- `DELETE /api/v1/departements/{id}` - Supprimer un département

### Semestres
- `GET /api/v1/semestres` - Lister tous les semestres
- `POST /api/v1/semestres` - Créer un semestre
- `GET /api/v1/semestres/{id}` - Voir un semestre
- `PUT /api/v1/semestres/{id}` - Modifier un semestre
- `DELETE /api/v1/semestres/{id}` - Supprimer un semestre

### Matières
- `GET /api/v1/matieres` - Lister toutes les matières
- `POST /api/v1/matieres` - Créer une matière
- `GET /api/v1/matieres/{id}` - Voir une matière
- `PUT /api/v1/matieres/{id}` - Modifier une matière
- `DELETE /api/v1/matieres/{id}` - Supprimer une matière

### Modules
- `GET /api/v1/modules` - Lister tous les modules
- `POST /api/v1/modules` - Créer un module
- `GET /api/v1/modules/{id}` - Voir un module
- `PUT /api/v1/modules/{id}` - Modifier un module
- `DELETE /api/v1/modules/{id}` - Supprimer un module

## Exemples d'utilisation

### 1. Créer un département
```json
POST /api/v1/departements
{
    "nom": "Informatique",
    "code": "INFO",
    "description": "Département d'informatique"
}
```

### 2. Créer un semestre
```json
POST /api/v1/semestres
{
    "nom": "Semestre 1",
    "description": "Premier semestre de l'année"
}
```

### 3. Créer une matière
```json
POST /api/v1/matieres
{
    "nom": "Mathématiques",
    "code": "MAT101",
    "description": "Mathématiques fondamentales",
    "departement_id": 1,
    "credits": 3
}
```

### 4. Créer un module
```json
POST /api/v1/modules
{
    "nom": "Introduction aux algorithmes",
    "cours_id": 1,
    "contenu": "Contenu du module sur les algorithmes",
    "ordre": 1
}
```

## Ordre de création recommandé

1. **D'abord créer un département** (nécessaire pour les matières)
2. **Ensuite créer un semestre** (optionnel mais recommandé)
3. **Puis créer les matières** (liées à un département)
4. **Enfin créer les modules** (liés à des cours)

## Tests disponibles

### Script de test PHP
- `backend/test_debug.php` : Test direct avec les modèles Laravel
- `backend/test_api_endpoints.php` : Test des endpoints API avec cURL

### Commandes pour tester
```bash
# Démarrer le serveur Laravel
php artisan serve

# Tester avec le script PHP
php backend/test_debug.php

# Tester les endpoints API
php backend/test_api_endpoints.php
```

## Logs et debugging

Tous les contrôleurs incluent désormais :
- Logs détaillés pour chaque opération
- Gestion des erreurs avec messages clairs
- Codes de statut HTTP appropriés

Les logs sont disponibles dans :
- `storage/logs/laravel.log`

## Validation des données

### Semestre
- `nom` : requis, string, max 255
- `description` : optionnel, string
- `date_debut` : auto-généré (date du jour)
- `date_fin` : auto-généré (date du jour + 6 mois)
- `is_active` : auto-généré (true)

### Matière
- `nom` : requis, string, max 255
- `code` : requis, string, max 255, unique
- `description` : requis, string
- `departement_id` : requis, integer, exists:departements,id
- `credits` : optionnel, integer, min 1, défaut 1

### Module
- `nom` : requis, string
- `cours_id` : requis, integer, exists:cours,id
- `titre` : optionnel, string
- `contenu` : optionnel, string
- `ordre` : optionnel, integer, défaut 1
