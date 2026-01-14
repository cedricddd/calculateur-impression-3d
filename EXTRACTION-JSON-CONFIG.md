# 🎯 Extraction Complète des Fichiers 3MF

**Version** : 3.4.0  
**Date** : 14 janvier 2026  
**Amélioration** : Extraction depuis JSON et fichiers config

---

## 🎉 Nouveauté

Le calculateur extrait maintenant **toutes les données d'impression** depuis les fichiers 3MF, même ceux téléchargés depuis **MakerWorld** ou d'autres sources !

---

## 📦 Sources de Données

Le système cherche les données dans **3 emplacements** (par ordre de priorité) :

### **1. Fichiers JSON Bambu Studio** ⭐ (Priorité Haute)

**Fichier** : `Metadata/plate_1.json` (ou plate_2, plate_3, etc.)

**Données extraites** :
```json
{
  "prediction": 19350,           // Temps en secondes
  "filament_used_g": "142.5",   // Poids en grammes
  "filament_used_mm": "47500",  // Longueur en millimètres
  "layer_height": "0.2",        // Hauteur de couche
  "infill_density": "20"        // Taux de remplissage
}
```

**Avantages** :
- ✅ Données exactes depuis le slicer
- ✅ Temps d'impression réel
- ✅ Poids de filament précis
- ✅ Support des fichiers MakerWorld

---

### **2. Fichiers Config** (Priorité Moyenne)

**Fichier** : `Metadata/slice_info.config`

**Format** : `key = value`

**Données extraites** :
```ini
layer_height = 0.2
print_speed = 60
sparse_infill_density = 20%
default_speed = 50
```

**Avantages** :
- ✅ Paramètres de tranchage détaillés
- ✅ Vitesse d'impression
- ✅ Remplissage
- ✅ Hauteur de couche

---

### **3. Métadonnées XML** (Priorité Basse)

**Fichier** : `3D/3dmodel.model`

**Format** : Balises `<metadata name="..." >`

**Données extraites** :
```xml
<metadata name="print_time">19350</metadata>
<metadata name="filament_weight">142.5</metadata>
<metadata name="layer_height">0.2</metadata>
```

**Avantages** :
- ✅ Standard 3MF
- ✅ Compatible tous slicers
- ⚠️ Parfois incomplet

---

## 🔍 Algorithme d'Extraction

### **Ordre de Priorité**

Pour chaque donnée, le système cherche dans cet ordre :

```
1. Fichier JSON (plate_X.json)
   ↓
2. Fichier Config (slice_info.config)
   ↓
3. Métadonnées XML (3dmodel.model)
   ↓
4. Valeur par défaut
```

### **Exemple : Temps d'Impression**

```javascript
// 1. Chercher dans JSON
if (plateData?.prediction) {
    printTime = plateData.prediction; // ✅ Trouvé !
}
// 2. Sinon, chercher dans XML
else if (metadata['print_time']) {
    printTime = metadata['print_time'];
}
// 3. Sinon, valeur par défaut
else {
    printTime = 0; // Non disponible
}
```

---

## 📊 Données Extraites

| Donnée | Source 1 (JSON) | Source 2 (Config) | Source 3 (XML) | Défaut |
|--------|-----------------|-------------------|----------------|--------|
| **Temps** | `prediction` ou `print_time` | - | `print_time` | 0 |
| **Poids** | `filament_used_g` ou `weight` | - | `filament_weight` | 0 |
| **Longueur** | `filament_used_mm` | - | `filament_length` | 0 |
| **Hauteur** | `layer_height` | `layer_height` | `layer_height` | 0.2 mm |
| **Vitesse** | - | `print_speed` ou `default_speed` | `print_speed` | 50 mm/s |
| **Remplissage** | `infill_density` | `sparse_infill_density` | `fill_density` | 20% |

---

## 🎯 Cas d'Usage

### **Cas 1 : Fichier Tranché dans Bambu Studio**

✅ **Toutes les données disponibles** :
- JSON : Temps, poids, longueur
- Config : Vitesse, hauteur, remplissage
- XML : Métadonnées du modèle

**Résultat** : Calcul de coût **100% précis** ✅

---

### **Cas 2 : Fichier Téléchargé depuis MakerWorld**

⚠️ **Données partielles** :
- JSON : **Peut contenir** temps, poids, longueur
- Config : Paramètres recommandés
- XML : Informations du designer

**Résultat** : Calcul précis **si les données sont présentes** ✅

---

### **Cas 3 : Fichier 3MF d'un Autre Slicer (PrusaSlicer, Cura)**

⚠️ **Format différent** :
- Pas de fichier JSON
- Métadonnées dans XML uniquement
- Format variable selon le slicer

**Résultat** : Extraction depuis XML (standard 3MF) ✅

---

## 🔧 Format des Données

### **Temps d'Impression**

**Formats supportés** :
```javascript
// Secondes (nombre)
"prediction": 19350

// Format texte
"print_time": "5h 23m"

// L'algorithme détecte automatiquement le format
```

**Conversion** :
```javascript
"5h 23m" → 5 * 3600 + 23 * 60 = 19380 secondes
```

---

### **Taux de Remplissage**

**Formats supportés** :
```javascript
// Pourcentage
"sparse_infill_density": "20%"

// Décimal
"infill_density": "0.2"

// Nombre entier
"fill_density": "20"
```

**Conversion automatique** :
```javascript
"0.2" → 20%  (multiplication par 100)
"20%" → 20   (suppression du symbole %)
"20"  → 20   (pas de conversion)
```

---

## 📋 Logs de Debug

Le système affiche des logs détaillés dans la console :

```
🔍 Recherche des fichiers JSON/config...
📄 Lecture du fichier: Metadata/plate_1.json
✅ Données de plaque JSON chargées
   Clés trouvées: prediction, filament_used_g, filament_used_mm, ...

📄 Lecture du fichier: Metadata/slice_info.config
✅ Configuration de tranchage chargée
   Paramètres trouvés: 45

🎯 Extraction des données d'impression...
   ⏱️ Temps depuis JSON (prediction): 19350 secondes
   ⚖️ Poids depuis JSON (filament_used_g): 142.5 g
   📏 Longueur depuis JSON: 47500 mm
   📐 Hauteur depuis config: 0.2 mm
   🏃 Vitesse depuis config: 60 mm/s
   📊 Remplissage depuis config: 20 %

📋 Résumé des données extraites:
   ⏱️ Temps: 19350 secondes (323 minutes)
   ⚖️ Poids filament: 142.5 g
   📏 Longueur filament: 47500 mm
   📐 Hauteur couche: 0.2 mm
   🏃 Vitesse: 60 mm/s
   📊 Remplissage: 20 %

✅ Extraction 3MF terminée avec succès !
```

---

## ✅ Avantages

### **Avant (v3.3.1)**
- ❌ Fichiers MakerWorld : Données manquantes (0s, 0g)
- ⚠️ Extraction XML uniquement
- ⚠️ Paramètres par défaut si absents

### **Maintenant (v3.4.0)**
- ✅ Fichiers MakerWorld : **Extraction complète** depuis JSON
- ✅ Fichiers tranchés : **Toutes les données** extraites
- ✅ **3 sources de données** (JSON, Config, XML)
- ✅ **Ordre de priorité** intelligent
- ✅ **Logs détaillés** pour diagnostic

---

## 🧪 Test

### **Avec test-3mf-simple.html**

1. **Ouvrez** `test-3mf-simple.html`
2. **Glissez** un fichier 3MF (MakerWorld ou tranché)
3. **Regardez** la console :
   ```
   🔍 Recherche des fichiers JSON/config...
   ✅ Données de plaque JSON chargées
   ✅ Configuration de tranchage chargée
   🎯 Extraction des données...
   ```
4. **Vérifiez** les résultats :
   - ⏱️ Temps d'impression (si disponible)
   - ⚖️ Poids de filament (si disponible)
   - 📏 Longueur (si disponible)
   - 📐 Hauteur de couche ✅
   - 🏃 Vitesse ✅
   - 📊 Remplissage ✅

---

## 📚 Compatibilité

| Slicer | JSON | Config | XML | Résultat |
|--------|------|--------|-----|----------|
| **Bambu Studio** | ✅ | ✅ | ✅ | 100% précis |
| **MakerWorld** | ⚠️ | ⚠️ | ✅ | Précis si données présentes |
| **PrusaSlicer** | ❌ | ❌ | ✅ | Depuis XML (standard) |
| **Cura** | ❌ | ❌ | ⚠️ | Partiel (dépend du format) |

---

## 🎉 Résultat

**Avec cette amélioration** :
- ✅ Support complet des fichiers MakerWorld
- ✅ Extraction maximale depuis tous les formats
- ✅ Calculs précis même sans tranchage local
- ✅ Logs détaillés pour diagnostic

**Le calculateur est maintenant compatible avec tous les types de fichiers 3MF !** 🎊

---

## 📖 Documentation Complète

- **README.md** : Documentation générale
- **SUPPORT-3MF-COMPLET.md** : Documentation technique 3MF
- **TEST-3MF-MODE-EMPLOI.md** : Guide du test simple
- **EXTRACTION-JSON-CONFIG.md** : Ce fichier

---

**Version** : 3.4.0  
**Date** : 14 janvier 2026  
**Amélioration** : ✅ Extraction depuis JSON et Config  
**Impact** : Support complet des fichiers MakerWorld
