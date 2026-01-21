# 🎨 Guide du Thème - Orange, Bleu, Vert

Ce guide explique comment utiliser le nouveau thème de couleurs à trois tons dans l'application.

## 🌈 Palette de Couleurs

### Orange (Énergie, Action, Importance)
- **50**: `#fff7ed` - Très clair
- **100**: `#ffedd5` - Clair
- **200**: `#fed7aa` - Pâle
- **300**: `#fdba74` - Lumineux
- **400**: `#fb923c` - Vif
- **500**: `#f97316` - **Principal**
- **600**: `#ea580c` - Foncé
- **700**: `#c2410c` - Très foncé
- **800**: `#9a3412` - Sombre
- **900**: `#7c2d12` - Très sombre

### Bleu (Information, Calme, Professionnel)
- **50**: `#eff6ff` - Très clair
- **100**: `#dbeafe` - Clair
- **200**: `#bfdbfe` - Pâle
- **300**: `#93c5fd` - Lumineux
- **400**: `#60a5fa` - Vif
- **500**: `#3b82f6` - **Principal**
- **600**: `#2563eb` - Foncé
- **700**: `#1d4ed8` - Très foncé
- **800**: `#1e40af` - Sombre
- **900**: `#1e3a8a` - Très sombre

### Vert (Succès, Validation, Nature)
- **50**: `#f0fdf4` - Très clair
- **100**: `#dcfce7` - Clair
- **200**: `#bbf7d0` - Pâle
- **300**: `#86efac` - Lumineux
- **400**: `#4ade80` - Vif
- **500**: `#22c55e` - **Principal**
- **600**: `#16a34a` - Foncé
- **700**: `#15803d` - Très foncé
- **800**: `#166534` - Sombre
- **900**: `#14532d` - Très sombre

## 🎯 Utilisation Sémantique

### Orange - Actions Principales
- Boutons d'action primaires
- Alertes importantes
- Éléments interactifs principaux
- Statuts "en attente" ou "urgent"

```tsx
<Button variant="orange">
  Action Principale
</Button>

<StatusBadge status="warning">
  Attention
</StatusBadge>
```

### Bleu - Information et Navigation
- Liens et navigation
- Informations contextuelles
- Boutons secondaires
- Éléments de formulaire

```tsx
<Button variant="blue">
  Action Secondaire
</Button>

<a className="text-blue-600 hover:text-blue-800">
  Lien
</a>
```

### Vert - Validation et Succès
- Messages de succès
- Éléments validés
- Boutons de confirmation
- Statuts positifs

```tsx
<Button variant="green">
  Valider
</Button>

<StatusBadge status="success">
  Succès
</StatusBadge>
```

## 🧩 Composants Thémés

### StatCard
Pour afficher des statistiques avec icône et tendance.

```tsx
<StatCard
  title="Utilisateurs"
  value="1,234"
  subtitle="Total actifs"
  icon={Users}
  color="orange"
  trend="+12%"
  positive={true}
/>
```

### ActionCard
Pour les cartes d'action avec lien.

```tsx
<ActionCard
  title="Gestion des utilisateurs"
  description="Ajoutez, modifiez ou supprimez des utilisateurs"
  icon={Users}
  color="orange"
  href="/dashboard/admin/users"
/>
```

### ProgressCard
Pour afficher la progression.

```tsx
<ProgressCard
  title="Completion du profil"
  current={75}
  total={100}
  color="orange"
/>
```

### StatusBadge
Pour les badges de statut.

```tsx
<StatusBadge status="success">
  <CheckCircle className="w-3 h-3 mr-1" />
  Succès
</StatusBadge>
```

### GradientText
Pour les titres avec dégradé.

```tsx
<GradientText from="orange" to="blue">
  Titre Dégradé
</GradientText>
```

## 🎨 Boutons

### Variants Disponibles
- `default` - Dégradé orange-bleu
- `orange` - Dégradé orange
- `blue` - Dégradé bleu
- `green` - Dégradé vert
- `primary` - Dégradé orange-bleu-vert complet
- `outline` - Contour gris
- `secondary` - Gris clair
- `ghost` - Transparent au survol
- `link` - Style lien

```tsx
<Button variant="orange">Orange</Button>
<Button variant="blue">Bleu</Button>
<Button variant="green">Vert</Button>
<Button variant="primary">Dégradé Complet</Button>
```

## 🎯 Dégradés

### Dégradés Disponibles
- `from-orange-500 to-orange-600` - Orange simple
- `from-blue-500 to-blue-600` - Bleu simple
- `from-green-500 to-green-600` - Vert simple
- `from-orange-500 via-blue-500 to-green-500` - Complet

### Utilisation avec le ThemeProvider
```tsx
const { getGradient } = useTheme();

<div className={`bg-gradient-to-r ${getGradient('orange', 'blue')}`}>
  Contenu dégradé
</div>
```

## 📋 Cartes

### Styles de Cartes
Les cartes utilisent un style glassmorphism avec des bordures colorées.

```tsx
<Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100">
  <CardHeader>
    <CardTitle className="text-orange-800">Titre Orange</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-orange-700">Contenu de la carte</p>
  </CardContent>
</Card>
```

## 🔧 Utilisation du ThemeProvider

Le ThemeProvider fournit un accès facile aux couleurs et utilitaires.

```tsx
import { useTheme } from '@/components/theme/ThemeProvider';

function MyComponent() {
  const { colors, getGradient, getColorClass, getCardClass, getButtonClass } = useTheme();
  
  return (
    <div className={getCardClass('orange')}>
      <h2 className={getColorClass('orange', 600)}>Titre</h2>
      <button className={getButtonClass('blue')}>Bouton</button>
    </div>
  );
}
```

## 🎯 Bonnes Pratiques

### 1. Cohérence des Couleurs
- Utilisez l'orange pour les actions principales
- Utilisez le bleu pour les informations et la navigation
- Utilisez le vert pour les validations et succès

### 2. Hiérarchie Visuelle
- Les éléments importants utilisent l'orange
- Les éléments secondaires utilisent le bleu
- Les éléments de validation utilisent le vert

### 3. Accessibilité
- Assurez-vous que les contrastes respectent les normes WCAG
- Utilisez les nuances claires (50-100) pour les arrière-plans
- Utilisez les nuances foncées (600-900) pour le texte

### 4. Consistance
- Utilisez les composants thémés au lieu de styles personnalisés
- Suivez la palette de couleurs définie
- Maintenez la cohérence dans toute l'application

## 🚀 Démonstration

Visitez `/dashboard/theme-demo` pour voir une démonstration complète du thème avec tous les composants et exemples d'utilisation.

## 📝 Notes de Développement

### CSS Variables
Le thème utilise des variables CSS définies dans `globals.css` :

```css
:root {
  --orange-primary: #f97316;
  --blue-primary: #3b82f6;
  --green-primary: #22c55e;
  --gradient-primary: linear-gradient(135deg, var(--orange-primary) 0%, var(--blue-primary) 50%, var(--green-primary) 100%);
}
```

### Animations
Les animations sont incluses pour les transitions fluides :
- `animate-fadeInUp` - Apparition par le bas
- `animate-scaleIn` - Mise à l'échelle
- `animate-pulse-slow` - Pulse lent
- `animate-gradient-shift` - Dégradé animé

Ce thème assure une expérience utilisateur cohérente et moderne avec une identité visuelle forte basée sur les trois couleurs principales.
