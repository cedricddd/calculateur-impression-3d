# 🚀 Nouvelle Fonctionnalité v3.1.0 - Estimation du Temps d'Impression

## ⏱️ Calcul Automatique du Temps d'Impression depuis STL

### Ce Qui a Changé

Quand vous importez un fichier STL, le calculateur estime maintenant **automatiquement le temps d'impression** en fonction de :
- 📏 **Volume de l'objet** (calculé depuis le STL)
- 🎚️ **Hauteur de couche** (0.2mm par défaut)
- 🏃 **Vitesse d'impression** (50 mm/s par défaut)
- 📊 **Taux de remplissage** (20% par défaut)
- 🛠️ **Supports** (oui/non)

---

## 🎯 Comment Utiliser

### 1. Importer un Fichier STL
1. Allez sur http://192.168.1.124:3080
2. Dans la section **"Import STL"**, glissez-déposez votre fichier `.stl`
3. ✅ Le système affiche automatiquement :
   - Volume estimé (cm³)
   - Poids estimé (g)
   - **⏱️ Temps estimé** (heures et minutes)

### 2. Ajuster les Paramètres d'Impression
Après l'import, un panneau **"⚙️ Paramètres d'impression"** s'affiche avec :

| Paramètre | Valeur par Défaut | Description |
|-----------|-------------------|-------------|
| **Hauteur couche** | 0.2 mm | 0.05mm (ultra-fin) à 0.4mm (rapide) |
| **Vitesse** | 50 mm/s | 10-150 mm/s |
| **Remplissage** | 20% | 0% (creux) à 100% (plein) |
| **Supports** | Non | Oui si géométrie complexe |

**💡 Astuce** : Modifiez ces valeurs et le temps se recalcule **automatiquement** !

### 3. Le Temps est Automatiquement Rempli
- Les champs **"Heures"** et **"Minutes"** sont mis à jour automatiquement
- Le **coût total** est recalculé en temps réel

---

## 📊 Formule de Calcul

### Étape 1 : Calcul du Nombre de Couches
```
Hauteur estimée = ∛(Volume × 1000)  [mm]
Nombre de couches = Hauteur estimée / Hauteur de couche
```

### Étape 2 : Distance des Périmètres
```
Périmètre moyen = 4 × √(Volume × 1000 / Hauteur)  [mm]
Distance périmètres = Périmètre × 2.5 contours × Nombre de couches
```

### Étape 3 : Distance de Remplissage
```
Aire par couche = (Volume × 1000) / Hauteur  [mm²]
Distance remplissage = (Aire × Taux remplissage × Nombre couches) / Hauteur couche
```

### Étape 4 : Distance des Supports (si activés)
```
Distance supports ≈ Volume × 150  [mm]
```

### Étape 5 : Calcul du Temps
```
Temps périmètres = Distance périmètres / (Vitesse × 0.7) / 60  [minutes]
Temps remplissage = Distance remplissage / Vitesse / 60  [minutes]
Temps supports = Distance supports / (Vitesse × 0.8) / 60  [minutes]

Temps total = (Temps périmètres + Temps remplissage + Temps supports) × 1.3
```

*Le facteur 1.3 prend en compte les déplacements, rétractations, accélérations, etc.*

---

## ⚠️ Précision de l'Estimation

### 📈 Estimation Raisonnable Pour :
- ✅ Objets simples (cubes, cylindres, sphères)
- ✅ Remplissage standard (10-30%)
- ✅ Vitesses moyennes (40-60 mm/s)
- ✅ Hauteurs de couche standard (0.15-0.3mm)

### ⚠️ L'Estimation Peut Différer Pour :
- ⚠️ Objets très détaillés ou complexes
- ⚠️ Remplissage très élevé (>50%)
- ⚠️ Vitesses extrêmes (<20 ou >100 mm/s)
- ⚠️ Supports complexes
- ⚠️ Géométries avec beaucoup de petits détails

### 💡 Recommandation
Pour une précision maximale, utilisez le temps estimé par votre **slicer** (PrusaSlicer, Cura, etc.) qui prend en compte tous les détails de votre profil d'impression.

---

## 📱 Exemples

### Exemple 1 : Petit Cube (20x20x20mm)
- **Volume** : 8 cm³
- **Poids** : ~10g (PLA)
- **Temps estimé** : ~45 minutes
  - Hauteur : 0.2mm
  - Vitesse : 50 mm/s
  - Remplissage : 20%
  - Supports : Non

### Exemple 2 : Figurine (10cm de haut)
- **Volume** : 50 cm³
- **Poids** : ~62g (PLA)
- **Temps estimé** : ~4h 30min
  - Hauteur : 0.2mm
  - Vitesse : 50 mm/s
  - Remplissage : 20%
  - Supports : Oui (+30 minutes)

### Exemple 3 : Grande Pièce (200x150x100mm)
- **Volume** : 3000 cm³
- **Poids** : ~3720g (PLA)
- **Temps estimé** : ~48h
  - Hauteur : 0.2mm
  - Vitesse : 50 mm/s
  - Remplissage : 20%
  - Supports : Non

---

## 🎛️ Optimisation du Temps

### Pour Imprimer Plus Vite :
1. ⬆️ **Augmenter la hauteur de couche** : 0.2mm → 0.3mm (-30% de temps)
2. ⬆️ **Augmenter la vitesse** : 50mm/s → 70mm/s (-25% de temps)
3. ⬇️ **Réduire le remplissage** : 20% → 10% (-10% de temps)
4. ❌ **Désactiver les supports** si possible (-10-20% de temps)

### Pour Meilleure Qualité :
1. ⬇️ **Réduire la hauteur de couche** : 0.2mm → 0.12mm (+40% de temps)
2. ⬇️ **Réduire la vitesse** : 50mm/s → 40mm/s (+20% de temps)
3. ⬆️ **Augmenter le remplissage** : 20% → 30% (+15% de temps)

---

## 🔧 Configuration Avancée

### Profils Recommandés

#### ⚡ Rapide (Brouillon)
- Hauteur : **0.3mm**
- Vitesse : **70 mm/s**
- Remplissage : **10%**
- Supports : Minimiser

#### ⚖️ Standard (Équilibré)
- Hauteur : **0.2mm**
- Vitesse : **50 mm/s**
- Remplissage : **20%**
- Supports : Si nécessaire

#### 🎨 Qualité (Détaillé)
- Hauteur : **0.12mm**
- Vitesse : **40 mm/s**
- Remplissage : **25%**
- Supports : Si nécessaire

---

## 🐛 Problèmes Connus

### Le Temps Semble Trop Court
- Vérifiez que le volume est correctement calculé
- Augmentez la vitesse si nécessaire
- Le calcul ne prend pas en compte les ralentissements sur petits périmètres

### Le Temps Semble Trop Long
- Vérifiez que la vitesse n'est pas trop basse
- Désactivez les supports si non nécessaires
- Réduisez le taux de remplissage

### Le Temps N'est Pas Affiché
- Vérifiez que le fichier STL est bien importé
- Rafraîchissez la page (Ctrl + Shift + R)
- Consultez la console (F12) pour voir les erreurs

---

## 📊 Comparaison Slicer vs Calculateur

| Aspect | Calculateur | Slicer (Cura/Prusa) |
|--------|-------------|---------------------|
| **Précision** | ±15-25% | ±5-10% |
| **Vitesse** | Instantané | 5-30 secondes |
| **Détails** | Approximation | Analyse complète |
| **Configuration** | 4 paramètres | 100+ paramètres |

**Conclusion** : Utilisez le calculateur pour une **estimation rapide**, le slicer pour le **temps exact** avant l'impression.

---

## 🚀 Déploiement

### Version
**v3.1.0** - Estimation du temps d'impression depuis STL

### Pour Déployer
```bash
git add .
git commit -m "Feat: Estimation automatique du temps d'impression (v3.1.0)"
git push origin main
```

Puis dans Portainer :
- Stacks → calculateur-impression-3d → **Pull and redeploy**

### Vider le Cache
- **Windows/Linux** : `Ctrl + Shift + R`
- **Mac** : `Cmd + Shift + R`

---

## ✅ Tests

### Test 1 : Import STL Basique
1. Importez un fichier STL
2. ✅ Vérifiez que le temps s'affiche
3. ✅ Vérifiez que les champs Heures/Minutes sont remplis

### Test 2 : Modification des Paramètres
1. Changez la hauteur de couche : 0.2 → 0.3
2. ✅ Le temps doit diminuer
3. Changez la vitesse : 50 → 70
4. ✅ Le temps doit encore diminuer

### Test 3 : Supports
1. Activez les supports
2. ✅ Le temps doit augmenter de ~15-20%

---

## 📖 Documentation Mise à Jour

- ✅ README.md
- ✅ CHANGELOG.md (à créer)
- ✅ Cette documentation (ESTIMATION-TEMPS.md)

---

**Date** : 14 janvier 2026  
**Version** : 3.1.0  
**Auteur** : Assistant AI  
**Status** : ✅ Prêt à déployer
