# Guide : Supprimer l'Avertissement Tailwind

## Option 1 : Ignorer (Recommandé)

L'avertissement n'affecte pas le fonctionnement. Votre calculateur est un outil interne.

**Avantages de garder le CDN** :
- ✅ Pas de build nécessaire
- ✅ Maintenance simplifiée
- ✅ Mises à jour automatiques de Tailwind
- ✅ Fonctionne parfaitement

---

## Option 2 : Passer à Tailwind Compilé

### Étape 1 : Installer Node.js (si pas déjà fait)

**Windows** : https://nodejs.org/  
**Linux/Mac** : `sudo apt install nodejs npm` ou `brew install node`

### Étape 2 : Créer le Projet Tailwind

```bash
cd /chemin/vers/calculateur-impression-3d

# Initialiser package.json
npm init -y

# Installer Tailwind
npm install -D tailwindcss

# Créer la config
npx tailwindcss init
```

### Étape 3 : Créer `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Étape 4 : Créer `src/input.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Étape 5 : Build Script

**Dans `package.json`** :

```json
{
  "scripts": {
    "build:css": "tailwindcss -i ./src/input.css -o ./css/tailwind.css --minify"
  }
}
```

### Étape 6 : Build

```bash
npm run build:css
```

### Étape 7 : Modifier `index.html`

**Remplacer** :
```html
<script src="https://cdn.tailwindcss.com"></script>
```

**Par** :
```html
<link href="css/tailwind.css" rel="stylesheet">
```

### Étape 8 : Mettre à Jour le Dockerfile

```dockerfile
COPY css/ /usr/share/nginx/html/css/
```

---

## Option 3 : Supprimer Complètement Tailwind

Si vous n'utilisez pas beaucoup de classes Tailwind, vous pouvez remplacer par du CSS pur.

**Avantage** : Aucune dépendance  
**Inconvénient** : Plus de CSS à écrire manuellement

---

## Recommandation

**Gardez le CDN Tailwind !**

**Raisons** :
1. Ça fonctionne parfaitement
2. C'est un outil interne (pas besoin d'optimisation extrême)
3. Maintenance simplifiée
4. L'avertissement est juste informatif, pas une erreur

**Si vous voulez vraiment le supprimer** : Suivez l'Option 2 ci-dessus.
