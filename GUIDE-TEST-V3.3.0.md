# 🧪 Guide de Test - Version 3.3.0

## ✅ Messages Console Normaux (Ignorez-les)

Ces messages sont **normaux** et n'affectent pas le fonctionnement :

```
(index):64 cdn.tailwindcss.com should not be used in production
```
→ ⚠️ Avertissement Tailwind CSS (pas grave)

```
subscriptionsPass.js ver. 1.0.2
```
→ 🔒 Extension de navigateur (gestionnaire de mots de passe)

```
Failed to load resource: favicon.ico 404
```
→ 🖼️ Icône du site manquante (corrigé dans v3.3.1)

---

## 🧪 Tests à Effectuer

### Test 1 : Import Fichier STL ✅

1. **Préparez** un fichier `.stl`
2. **Glissez-déposez** dans la zone "Import STL / 3MF"
3. **Vérifiez** dans la console (F12) :

**Messages attendus :**
```
📁 Fichier sélectionné: piece.stl Type: Taille: XXXXX
🔷 Fichier STL détecté, analyse en cours...
📦 STL binaire détecté
🔺 Nombre de triangles: XXXX
📐 Volume calculé: XX.X cm³
⚖️ Poids estimé: XX.X g (densité: 1.24 g/cm³)
✅ Volume STL stocké: XX.X cm³
⏱️ Tentative de calcul du temps...
✓ Fonction updateTimeEstimate trouvée
🔍 updateTimeEstimate appelée
📊 Volume STL: XX.X cm³
⚙️ Paramètres: {layerHeight: 0.2, printSpeed: 50, ...}
⏱️ Temps calculé: X h X min
✅ Calcul du temps terminé avec succès
```

**Résultat attendu :**
- ✅ Volume affiché
- ✅ Poids affiché
- ✅ Temps estimé affiché
- ✅ Champs "Heures" et "Minutes" remplis
- ✅ Coût calculé

---

### Test 2 : Import Fichier 3MF 🎉 NOUVEAU

1. **Exportez** un fichier `.3mf` depuis votre slicer :
   - **PrusaSlicer** : Fichier → Exporter en tant que 3MF
   - **Bambu Studio** : Fichier → Exporter 3MF
   - **Cura** : Fichier → Sauvegarder → Format 3MF

2. **Glissez-déposez** dans la zone "Import STL / 3MF"

3. **Vérifiez** dans la console (F12) :

**Messages attendus :**
```
📁 Fichier sélectionné: piece.3mf Type: Taille: XXXXX
📦 Fichier 3MF détecté - Extraction des métadonnées...
🔓 Décompression du fichier 3MF...
✅ Fichier ZIP chargé, fichiers trouvés: X
📄 Lecture du fichier: 3D/3dmodel.model
📊 Métadonnées extraites: {print_time: "XXXX", filament_weight: "XX.X", ...}
🎯 Données extraites:
  ⏱️ Temps: XXXX secondes ( XXX minutes)
  ⚖️ Poids filament: XX.X g
  📏 Longueur filament: XXXXX.X mm
  📐 Hauteur couche: 0.X mm
  🏃 Vitesse: XX mm/s
  📊 Remplissage: XX %
🔄 Déclenchement du recalcul des coûts...
✅ Extraction 3MF terminée avec succès
```

**Résultat attendu :**
- ✅ Fichier : piece.3mf (3MF)
- ✅ Volume affiché (ou N/A)
- ✅ Poids **exact** affiché
- ✅ Temps **réel** affiché
- ✅ Champs automatiquement remplis :
  - Poids utilisé : XX.X g
  - Heures : X
  - Minutes : X
  - Hauteur couche : 0.X mm
  - Vitesse : XX mm/s
  - Remplissage : XX%
- ✅ Coût calculé avec valeurs exactes

---

### Test 3 : Modification des Paramètres

Après l'import d'un fichier (STL ou 3MF) :

1. **Modifiez** la hauteur de couche : 0.2 → 0.3
2. **Vérifiez** : Le temps se recalcule automatiquement
3. **Modifiez** la vitesse : 50 → 70
4. **Vérifiez** : Le temps diminue
5. **Activez** les supports : Non → Oui
6. **Vérifiez** : Le temps augmente

---

### Test 4 : Format Invalide

1. **Glissez** un fichier `.jpg`, `.pdf` ou autre
2. **Vérifiez** : Message d'erreur s'affiche
3. **Console** : Pas d'erreur rouge

---

## ❌ Messages d'Erreur à Surveiller

### Si Vous Voyez Ces Messages, C'est un Problème

**Erreur STL :**
```
❌ Erreur lors du traitement du fichier STL: [message]
```
→ Fichier STL corrompu ou format invalide

**Erreur 3MF :**
```
❌ Erreur lors du traitement du fichier 3MF: [message]
```
→ Fichier 3MF corrompu ou format non standard

**Erreur Calcul Temps :**
```
❌ Erreur calcul temps: [message]
```
→ Bug dans l'algorithme (signaler)

**Fonction Manquante :**
```
✗ Fonction updateTimeEstimate non trouvée
```
→ Cache du navigateur pas vidé (Ctrl + Shift + R)

---

## 🎯 Checklist de Vérification

### Après Import STL
- [ ] Volume affiché dans "Volume estimé"
- [ ] Poids affiché dans "Poids estimé"
- [ ] Temps affiché dans "Temps estimé"
- [ ] Champ "Heures" rempli
- [ ] Champ "Minutes" rempli
- [ ] Champ "Temps total" mis à jour
- [ ] Coût total calculé
- [ ] Aucune erreur rouge dans la console

### Après Import 3MF
- [ ] Nom du fichier affiché avec "(3MF)"
- [ ] Poids exact affiché (ou N/A si non disponible)
- [ ] Temps réel affiché (ou Non disponible)
- [ ] Champ "Poids utilisé" rempli automatiquement
- [ ] Champs "Heures" et "Minutes" remplis automatiquement
- [ ] Paramètres d'impression remplis (hauteur, vitesse, remplissage)
- [ ] Coût total calculé avec valeurs exactes
- [ ] Messages verts (✅) dans la console

---

## 🔍 Dépannage

### Le Temps N'est Pas Calculé (STL)

**Symptôme** : "Temps estimé" reste vide

**Vérifications** :
1. Console affiche "Volume STL stocké" ?
2. Console affiche "updateTimeEstimate appelée" ?
3. Console affiche "Temps calculé" ?

**Solutions** :
- Si volume = 0 : Fichier STL invalide
- Si fonction non trouvée : Videz le cache (Ctrl + Shift + R)
- Si erreur de calcul : Partagez le message d'erreur complet

### Le 3MF Ne Se Charge Pas

**Symptôme** : Erreur "Fichier .model non trouvé"

**Causes** :
- Fichier 3MF corrompu
- Format 3MF non standard
- Fichier trop gros (>50 MB)

**Solutions** :
1. Ré-exportez depuis le slicer
2. Vérifiez que vous avez **slicé** (pas juste ouvert)
3. Utilisez PrusaSlicer ou Bambu Studio

### Les Métadonnées Sont Manquantes (3MF)

**Symptôme** : "Temps estimé : Non disponible"

**Cause** : Le slicer n'a pas inclus les métadonnées

**Solutions** :
- Utilisez PrusaSlicer (métadonnées complètes)
- Avec Cura, certaines infos peuvent manquer
- Vérifiez que vous avez **slicé** avant d'exporter

---

## 📸 Captures d'Écran Recommandées

Pour un rapport de bug complet :

1. **Console complète** après import (F12)
2. **Section "Import STL / 3MF"** avec informations
3. **Champs remplis** (Heures, Minutes, Poids, etc.)
4. **Paramètres d'impression** (si 3MF)
5. **Coût total** calculé

---

## 🎉 Résultat Final

### Import STL ✅
- Temps **estimé** (±15-25% d'erreur)
- Calcul basé sur le volume

### Import 3MF ✅
- Temps **exact** depuis le slicer
- Poids **exact** depuis le slicer
- Paramètres **exacts**
- **Calcul 100% précis !**

---

**Version testée** : 3.3.0  
**Date** : 14 janvier 2026  
**Status** : ✅ Prêt pour les tests  
**Support** : Consultez [SUPPORT-3MF-COMPLET.md](SUPPORT-3MF-COMPLET.md) pour plus d'infos
