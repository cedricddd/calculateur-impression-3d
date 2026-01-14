# 🧪 Test 3MF Simple - Mode d'Emploi

## 📋 Objectif

Tester le support des fichiers 3MF et STL **sans déploiement** sur le serveur.

---

## 🚀 Utilisation

### **Étape 1 : Ouvrir le Fichier**

Double-cliquez simplement sur :
```
test-3mf-simple.html
```

Ou faites un **clic droit → Ouvrir avec → Navigateur Web**

---

### **Étape 2 : Glisser un Fichier**

1. **Exportez un fichier 3MF** depuis :
   - PrusaSlicer : Fichier → Exporter → 3MF
   - Bambu Studio : Fichier → Exporter 3MF
   - Ou utilisez un fichier STL

2. **Glissez-déposez** le fichier dans la zone :
   ```
   ☁️ Glissez votre fichier 3MF ou STL ici
   ```

3. **Attendez 2-3 secondes**

---

## 📊 Résultats Attendus

### **Pour un fichier 3MF :**

✅ **Console affiche** :
```
📁 Fichier sélectionné: piece.3mf
   Type: application/...
   Taille: XX.XX KB

📦 Fichier 3MF détecté - Extraction des métadonnées...
🔓 Décompression du fichier 3MF...
✅ Fichier ZIP chargé, fichiers trouvés: 8

📂 Contenu du fichier 3MF:
   - [Content_Types].xml
   - _rels/.rels
   - 3D/3dmodel.model
   - Metadata/thumbnail.png
   - ...

📄 Lecture du fichier: 3D/3dmodel.model

📊 8 métadonnées trouvées
   print_time: 18450
   filament_weight: 60.5
   layer_height: 0.2
   print_speed: 50
   fill_density: 20
   ...

🎯 Données extraites:
   ⏱️ Temps: 18450 secondes (308 minutes)
   ⚖️ Poids filament: 60.5 g
   📏 Longueur filament: 20123 mm
   📐 Hauteur couche: 0.2 mm
   🏃 Vitesse: 50 mm/s
   📊 Remplissage: 20 %

✅ Extraction 3MF terminée avec succès !
```

✅ **Zone Résultats affiche** :
- 📁 Nom du fichier
- ⏱️ Temps d'impression (5h 8min)
- ⚖️ Poids de filament (60.5 g)
- 📏 Longueur de filament (20.12 m)
- 📐 Hauteur de couche (0.2 mm)
- 🏃 Vitesse d'impression (50 mm/s)
- 📊 Taux de remplissage (20%)

---

### **Pour un fichier STL :**

✅ **Console affiche** :
```
📁 Fichier sélectionné: piece.stl
   Type: application/...
   Taille: XX.XX KB

📦 Fichier STL détecté - Analyse de la géométrie...
📄 Format détecté: STL Binaire
🔢 Nombre de triangles: 1234

🎯 Analyse terminée:
   📦 Volume: 48.52 cm³
   ⚖️ Poids estimé: 60.16 g (PLA 1.24 g/cm³)

✅ Analyse STL terminée avec succès !
```

✅ **Zone Résultats affiche** :
- 📁 Nom du fichier
- 📦 Volume (48.52 cm³)
- ⚖️ Poids estimé PLA (60.16 g)
- ℹ️ Note : Utilisez un fichier 3MF pour plus de précision

---

## 🔍 Vérifications

### ✅ JSZip Chargé
Dans la console, vous devez voir :
```
JSZip chargé: ✅ OK
```

Si vous voyez `❌ ERREUR`, JSZip n'est pas chargé (problème de connexion CDN).

---

### ✅ Toutes les Métadonnées Extraites

**Slicers compatibles** :

| Slicer | Support | Métadonnées |
|--------|---------|-------------|
| **PrusaSlicer** | ✅ Complet | Temps, Poids, Vitesse, Remplissage, Hauteur |
| **Bambu Studio** | ✅ Complet | Temps, Poids, Vitesse, Remplissage, Hauteur |
| **Cura** | ⚠️ Partiel | Temps, Poids (autres métadonnées limitées) |
| **Simplify3D** | ⚠️ Partiel | Temps, Poids (autres métadonnées limitées) |

---

## ⚠️ Problèmes Courants

### ❌ "Fichier .model non trouvé dans le 3MF"

**Cause** : Le fichier 3MF est corrompu ou mal formaté.

**Solution** : Ré-exportez depuis le slicer.

---

### ❌ "JSZip n'est pas chargé"

**Cause** : Connexion internet interrompue ou CDN bloqué.

**Solutions** :
1. Vérifiez votre connexion internet
2. Rechargez la page (F5)
3. Essayez dans un autre navigateur
4. Vérifiez que le CDN JSZip n'est pas bloqué par un pare-feu

---

### ❌ "Métadonnées vides"

**Cause** : Le fichier 3MF ne contient pas de métadonnées d'impression.

**Solutions** :
1. Vérifiez que le fichier a été **tranché** (sliced) avant export
2. Exportez depuis l'onglet **"Prévisualisation"** du slicer, pas depuis l'onglet "3D"
3. Utilisez PrusaSlicer ou Bambu Studio pour de meilleurs résultats

---

## 🎯 Cas d'Usage

### **Avant Déploiement**
- Tester que JSZip fonctionne correctement
- Vérifier que vos fichiers 3MF contiennent des métadonnées
- Comparer STL vs 3MF pour voir la différence de précision

### **Debug**
- Vérifier exactement quelles métadonnées sont extraites
- Voir le contenu complet d'un fichier 3MF
- Identifier pourquoi certaines métadonnées sont manquantes

### **Démonstration**
- Montrer à un client la différence entre STL et 3MF
- Expliquer pourquoi les fichiers 3MF sont plus précis
- Comparer les résultats de différents slicers

---

## ✨ Prochaine Étape

Une fois que ce test fonctionne parfaitement :

1. Déployez sur votre serveur Proxmox :
   ```bash
   git add .
   git commit -m "Feat: Support complet 3MF (v3.3.1)"
   git push origin main
   ```

2. Redéployez dans Portainer (Pull and redeploy)

3. Testez sur `http://192.168.1.124:3080`

---

## 📚 Documentation Complète

- [SUPPORT-3MF-COMPLET.md](SUPPORT-3MF-COMPLET.md) - Documentation technique complète
- [START-HERE.md](START-HERE.md) - Guide de déploiement rapide
- [README.md](README.md) - Documentation générale du projet

---

**Version** : 3.3.1  
**Date** : 14 janvier 2026  
**Status** : ✅ Test simple prêt à utiliser
