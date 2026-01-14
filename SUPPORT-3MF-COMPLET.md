# 🎉 Version 3.3.0 - Support Complet des Fichiers 3MF

## ✨ Fonctionnalité Majeure

**Support COMPLET des fichiers 3MF** avec extraction automatique de toutes les métadonnées !

---

## 🚀 Ce Qui Fonctionne Maintenant

### Fichiers STL ✅
- Analyse du volume
- Calcul du poids
- Estimation du temps d'impression

### Fichiers 3MF ✅ NOUVEAU !
- **Décompression automatique** du fichier ZIP
- **Extraction des métadonnées** :
  - ⏱️ Temps d'impression réel
  - ⚖️ Poids de filament exact
  - 📏 Longueur de filament
  - 📐 Hauteur de couche
  - 🏃 Vitesse d'impression
  - 📊 Taux de remplissage
- **Remplissage automatique** de tous les champs
- **Calcul automatique** du coût total

---

## 📋 Métadonnées Supportées

Le système extrait automatiquement ces informations depuis le fichier 3MF :

| Métadonnée | Champs compatibles | Usage |
|------------|-------------------|-------|
| **print_time** | `time`, `slic3r:print_time` | Temps d'impression (secondes) |
| **filament_weight** | `slic3r:filament_used_g` | Poids filament (grammes) |
| **filament_length** | `slic3r:filament_used_mm` | Longueur filament (mm) |
| **layer_height** | `slic3r:layer_height` | Hauteur de couche (mm) |
| **print_speed** | `slic3r:perimeter_speed` | Vitesse (mm/s) |
| **fill_density** | `slic3r:fill_density` | Remplissage (%) |

---

## 🎯 Compatibilité Slicers

### ✅ PrusaSlicer / SuperSlicer
- ✅ Métadonnées complètes
- ✅ Temps d'impression précis
- ✅ Poids de filament exact
- ✅ Tous les paramètres disponibles

### ✅ Bambu Studio
- ✅ Métadonnées complètes
- ✅ Format 3MF standard
- ✅ Toutes les informations extraites

### ⚠️ Cura
- ⚠️ Support partiel
- ✅ Géométrie 3D disponible
- ⚠️ Métadonnées limitées (Cura stocke moins d'infos dans 3MF)

### ⚠️ Simplify3D
- ⚠️ Support partiel
- ✅ Fichier 3MF lisible
- ⚠️ Format de métadonnées propriétaire

---

## 🧪 Utilisation

### Étape 1 : Exporter depuis Votre Slicer

#### PrusaSlicer
1. Configurez votre impression
2. Fichier → **Exporter** → **Exporter en tant que 3MF**
3. Sauvegardez le fichier

#### Bambu Studio
1. Préparez votre impression
2. Fichier → **Exporter 3MF**
3. Sauvegardez le fichier

#### Cura
1. Préparez votre impression
2. Fichier → **Sauvegarder** → Format **3MF**
3. Sauvegardez le fichier

### Étape 2 : Importer dans le Calculateur

1. Allez sur http://192.168.1.124:3080
2. **Glissez-déposez** votre fichier `.3mf`
3. ✅ Toutes les informations sont extraites automatiquement :
   - Temps d'impression (heures/minutes)
   - Poids de filament (grammes)
   - Paramètres d'impression
4. ✅ Le coût total est calculé automatiquement

---

## 📊 Exemple d'Extraction

### Console de Debug

Quand vous importez un fichier 3MF, la console (F12) affiche :

```
📁 Fichier sélectionné: piece.3mf Type: Taille: 2345678
📦 Fichier 3MF détecté - Extraction des métadonnées...
🔓 Décompression du fichier 3MF...
✅ Fichier ZIP chargé, fichiers trouvés: 8
📄 Lecture du fichier: 3D/3dmodel.model
📊 Métadonnées extraites: {print_time: "18450", filament_weight: "60.5", ...}
🎯 Données extraites:
  ⏱️ Temps: 18450 secondes ( 308 minutes)
  ⚖️ Poids filament: 60.5 g
  📏 Longueur filament: 20123.5 mm
  📐 Hauteur couche: 0.2 mm
  🏃 Vitesse: 50 mm/s
  📊 Remplissage: 20 %
🔄 Déclenchement du recalcul des coûts...
✅ Extraction 3MF terminée avec succès
```

### Résultat dans l'Interface

**Section "Import STL / 3MF"** :
- ✅ Fichier : piece.3mf (3MF)
- ✅ Volume estimé : 48.79 cm³
- ✅ Poids estimé : 60.5 g
- ✅ Temps estimé : 5h 8min

**Champs automatiquement remplis** :
- ✅ Poids utilisé : 60.5 g
- ✅ Heures : 5
- ✅ Minutes : 8
- ✅ Hauteur couche : 0.2 mm
- ✅ Vitesse : 50 mm/s
- ✅ Remplissage : 20%

**Coût total** : Calculé automatiquement avec les vraies valeurs !

---

## 🆚 STL vs 3MF

### Fichier STL
| Avantage | Inconvénient |
|----------|--------------|
| ✅ Universel | ❌ Pas de métadonnées |
| ✅ Simple | ❌ Temps estimé approximatif |
| ✅ Léger | ❌ Pas de paramètres d'impression |

**Résultat** : Estimation approximative

### Fichier 3MF
| Avantage | Inconvénient |
|----------|--------------|
| ✅ Métadonnées complètes | ⚠️ Moins universel |
| ✅ Temps réel | ⚠️ Fichier plus gros |
| ✅ Paramètres exacts | ⚠️ Dépend du slicer |

**Résultat** : **Valeurs exactes depuis le slicer** 🎯

---

## 🎉 Avantages du Support 3MF

### Avant (STL uniquement)
1. Importez un STL
2. Le calculateur **estime** le temps (~±25%)
3. Les paramètres sont **approximatifs**
4. Le poids est **calculé** (peut varier)

### Maintenant (3MF complet)
1. Importez un 3MF
2. Le calculateur utilise le **temps réel** du slicer
3. Les paramètres sont **exacts** (hauteur, vitesse, remplissage)
4. Le poids est **exact** (depuis le slicer)

**🎯 Résultat : Calcul de coût 100% précis !**

---

## 🔧 Support Technique

### Si Le Fichier 3MF Ne Se Charge Pas

**Symptôme** : Erreur "Fichier .model non trouvé"

**Causes possibles** :
1. Fichier 3MF corrompu
2. Format 3MF non standard
3. Fichier trop gros (>50 MB)

**Solutions** :
1. Ré-exportez le fichier depuis le slicer
2. Utilisez un fichier STL à la place
3. Vérifiez la console (F12) pour plus de détails

### Si Les Métadonnées Sont Manquantes

**Symptôme** : "Temps estimé : Non disponible"

**Cause** : Le slicer n'a pas inclus ces métadonnées dans le 3MF

**Solutions** :
1. Vérifiez que vous avez **slicé** le modèle (pas juste ouvert)
2. Utilisez PrusaSlicer ou Bambu Studio (métadonnées complètes)
3. Avec Cura, certaines infos peuvent manquer

---

## 📦 Structure d'un Fichier 3MF

Un fichier 3MF est un **fichier ZIP** contenant :

```
piece.3mf (ZIP)
├── [Content_Types].xml
├── _rels/
│   └── .rels
├── 3D/
│   └── 3dmodel.model      ← Géométrie + Métadonnées
├── Metadata/
│   ├── thumbnail.png
│   └── slic3r_config.ini
└── Textures/
    └── texture.png
```

Le calculateur lit le fichier **3dmodel.model** et extrait les balises `<metadata>`.

---

## 🚀 Déploiement

### Version
**v3.3.0** - Support complet des fichiers 3MF

### Pour Déployer
```bash
git add .
git commit -m "Feat: Support complet 3MF avec extraction métadonnées (v3.3.0)"
git push origin main
```

Puis dans Portainer :
- Stacks → calculateur-impression-3d → **Pull and redeploy**

### Vider le Cache
- **Windows/Linux** : `Ctrl + Shift + R`
- **Mac** : `Cmd + Shift + R`

---

## ✅ Tests

### Test 1 : Fichier 3MF depuis PrusaSlicer
1. Exportez un 3MF depuis PrusaSlicer
2. Glissez-le dans le calculateur
3. ✅ Temps, poids et paramètres sont remplis automatiquement

### Test 2 : Fichier 3MF depuis Bambu Studio
1. Exportez un 3MF depuis Bambu Studio
2. Glissez-le dans le calculateur
3. ✅ Toutes les informations sont extraites

### Test 3 : Console de Debug
1. Ouvrez F12 (console)
2. Importez un 3MF
3. ✅ Logs détaillés de l'extraction

---

## 🎯 Résumé

| Fonctionnalité | v3.2.0 | v3.3.0 |
|----------------|--------|--------|
| **Détection 3MF** | ✅ | ✅ |
| **Décompression ZIP** | ❌ | ✅ |
| **Extraction XML** | ❌ | ✅ |
| **Temps réel** | ❌ | ✅ |
| **Poids exact** | ❌ | ✅ |
| **Paramètres** | ❌ | ✅ |
| **Remplissage auto** | ❌ | ✅ |

---

**Version** : 3.3.0  
**Date** : 14 janvier 2026  
**Status** : ✅ Support 3MF complet  
**Bibliothèques** : JSZip 3.10.1

🎉 **Les fichiers 3MF sont maintenant complètement supportés !** 🎉
