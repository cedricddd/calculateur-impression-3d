# ✨ Version 3.2.0 - Support des Fichiers 3MF

## 🎉 Nouvelle Fonctionnalité

**Support des fichiers 3MF** (en plus des fichiers STL)

### Ce Qui a Changé

- ✅ L'interface accepte maintenant les fichiers **STL** et **3MF**
- ✅ Détection automatique du format de fichier
- ✅ Messages d'erreur explicites pour les formats non supportés
- ℹ️ Les fichiers 3MF affichent un message indiquant que le support complet arrive bientôt

---

## 📋 Formats Supportés

### ✅ Fichiers STL (Complet)
- **STL Binaire** : Analyse complète du volume
- **STL ASCII** : Analyse complète du volume
- **Calcul automatique** :
  - Volume (cm³)
  - Poids (g)
  - Temps d'impression estimé

### ⏳ Fichiers 3MF (En Développement)
- **Détection** : ✅ Le format est reconnu
- **Message informatif** : L'utilisateur est informé que le support arrive bientôt
- **Prochainement** :
  - Extraction du temps d'impression réel depuis le fichier
  - Extraction des paramètres d'impression (vitesse, température, etc.)
  - Extraction du poids de filament exact
  - Support multi-objets

---

## 🎯 Avantages du Format 3MF

Le format 3MF est plus moderne que STL et contient :

| Information | STL | 3MF |
|-------------|-----|-----|
| **Géométrie 3D** | ✅ | ✅ |
| **Couleurs/Textures** | ❌ | ✅ |
| **Multi-objets** | ❌ | ✅ |
| **Temps d'impression** | ❌ | ✅ |
| **Paramètres d'impression** | ❌ | ✅ |
| **Poids filament** | ❌ | ✅ |
| **Métadonnées** | ❌ | ✅ |

---

## 🚀 Utilisation

### Import STL (Fonctionne Maintenant)
1. Allez sur http://192.168.1.124:3080
2. Glissez-déposez un fichier `.stl`
3. ✅ Volume, poids et temps sont calculés automatiquement

### Import 3MF (Bientôt Disponible)
1. Glissez-déposez un fichier `.3mf`
2. ℹ️ Un message vous informe que le support arrive bientôt
3. En attendant, utilisez un fichier STL exporté depuis votre slicer

---

## 🔧 Comment Obtenir un Fichier STL depuis 3MF

Si vous avez un fichier 3MF et souhaitez l'utiliser maintenant :

### Méthode 1 : PrusaSlicer
1. Ouvrez le fichier `.3mf` dans PrusaSlicer
2. Fichier → Exporter → Exporter STL
3. Utilisez ce fichier STL

### Méthode 2 : Cura
1. Ouvrez le fichier `.3mf` dans Cura
2. Clic droit sur l'objet → Exporter → STL
3. Utilisez ce fichier STL

### Méthode 3 : Bambu Studio
1. Ouvrez le fichier `.3mf` dans Bambu Studio
2. Fichier → Exporter → STL
3. Utilisez ce fichier STL

---

## 📊 Logs de Debug

### Messages Console pour STL
```
📁 Fichier sélectionné: piece.stl Type: Taille: 1234567
🔷 Fichier STL détecté, analyse en cours...
📦 STL binaire détecté
🔺 Nombre de triangles: 5432
📐 Volume calculé: 48.5 cm³
⚖️ Poids estimé: 60.1 g (densité: 1.24 g/cm³)
✅ Volume STL stocké: 48.5 cm³
```

### Messages Console pour 3MF
```
📁 Fichier sélectionné: piece.3mf Type: Taille: 2345678
📦 Fichier 3MF détecté
```
Puis un message d'alerte s'affiche.

### Messages Console pour Format Invalide
```
📁 Fichier sélectionné: image.jpg Type: Taille: 123456
```
Puis un message d'erreur s'affiche.

---

## 🛠️ Prochaines Étapes (v3.3.0)

### Support Complet des Fichiers 3MF

**Ce qui sera ajouté** :
1. ✅ Décompression du fichier ZIP (3MF = fichier ZIP)
2. ✅ Lecture du fichier XML interne
3. ✅ Extraction des métadonnées :
   - Temps d'impression réel
   - Poids de filament exact
   - Température buse
   - Température plateau
   - Vitesse d'impression
   - Hauteur de couche
   - Taux de remplissage
4. ✅ Pré-remplissage automatique de tous les champs
5. ✅ Support multi-objets (calcul du total)

**Bibliothèques nécessaires** :
- JSZip pour décompresser le fichier
- XML Parser pour lire les métadonnées

---

## 🚀 Déploiement

### Version
**v3.2.0** - Support des fichiers 3MF (détection + message informatif)

### Pour Déployer
```bash
git add .
git commit -m "Feat: Support des fichiers 3MF (détection) - v3.2.0"
git push origin main
```

Puis dans Portainer :
- Stacks → calculateur-impression-3d → **Pull and redeploy**

### Vider le Cache
- **Windows/Linux** : `Ctrl + Shift + R`
- **Mac** : `Cmd + Shift + R`

---

## ✅ Tests

### Test 1 : Import STL
1. Glissez un fichier `.stl`
2. ✅ Analyse et calcul fonctionnent
3. ✅ Console affiche les logs

### Test 2 : Import 3MF
1. Glissez un fichier `.3mf`
2. ✅ Message informatif s'affiche
3. ✅ Console affiche "Fichier 3MF détecté"

### Test 3 : Format Invalide
1. Glissez un fichier `.jpg` ou `.pdf`
2. ✅ Message d'erreur s'affiche

---

## 📝 Notes Techniques

### Structure d'un Fichier 3MF
```
fichier.3mf (fichier ZIP)
├── [Content_Types].xml
├── _rels/
│   └── .rels
├── 3D/
│   └── 3dmodel.model (XML avec géométrie)
└── Metadata/
    ├── thumbnail.png
    ├── slicer_config.xml
    └── print_stats.xml
```

### Extraction des Métadonnées (v3.3.0)
```xml
<metadata name="time">12345</metadata> <!-- secondes -->
<metadata name="filament_weight">60.5</metadata> <!-- grammes -->
<metadata name="layer_height">0.2</metadata> <!-- mm -->
<metadata name="print_speed">50</metadata> <!-- mm/s -->
```

---

## 💡 Pourquoi Pas Maintenant ?

L'implémentation complète du support 3MF nécessite :
1. **Bibliothèque JSZip** (~100 KB) pour décompresser
2. **Parser XML** pour lire les métadonnées
3. **Tests approfondis** avec différents slicers (PrusaSlicer, Cura, Bambu Studio)
4. **Gestion des erreurs** pour fichiers 3MF mal formés

Pour l'instant, la **détection** est implémentée et un **message informatif** guide l'utilisateur.

---

**Version** : 3.2.0  
**Date** : 14 janvier 2026  
**Status** : ✅ Détection 3MF implémentée  
**Prochaine version** : 3.3.0 - Support complet 3MF

🎉 **Les fichiers 3MF sont reconnus ! Support complet bientôt disponible !** 🎉
