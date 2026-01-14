# 🐛 Debug: Temps d'Impression Ne Se Calcule Pas

## Problème Signalé

Le temps d'impression ne se calcule pas après l'import d'un fichier STL.

## Solution: Version avec Logs de Debug (v3.1.2)

J'ai ajouté des **logs de debug** dans la console pour identifier exactement où le problème se situe.

---

## 🔍 Comment Déboguer

### Étape 1: Déployer la Version avec Logs

```bash
# 1. Push GitHub
git add .
git commit -m "Debug: Ajout de logs pour diagnostiquer le calcul du temps (v3.1.2)"
git push origin main

# 2. Redéployer Portainer
# → Portainer → Stacks → calculateur-impression-3d → Pull and redeploy

# 3. Vider le cache ⚠️ IMPORTANT
# → Ctrl + Shift + R (Windows) ou Cmd + Shift + R (Mac)
```

### Étape 2: Tester avec la Console Ouverte

1. Allez sur http://192.168.1.124:3080
2. **Ouvrez la console JavaScript** : Appuyez sur `F12` → Onglet "Console"
3. Importez un fichier STL
4. **Lisez les messages** dans la console

---

## 📊 Messages de Debug à Surveiller

### Messages Attendus (Tout Fonctionne)

```
✅ Volume STL stocké: 48.5 cm³
⏱️ Tentative de calcul du temps...
✓ Fonction updateTimeEstimate trouvée
🔍 updateTimeEstimate appelée
📊 Volume STL: 48.5 cm³
⚙️ Paramètres: {layerHeight: 0.2, printSpeed: 50, infillDensity: "20%", supportsEnabled: false}
⏱️ Temps calculé: 5 h 30 min ( 330 minutes totales)
✅ Temps affiché dans stlTime: 5h 30min
✅ Champ printHours mis à jour: 5
✅ Champ printMinutes mis à jour: 30
🔄 Déclenchement du recalcul des coûts...
✅ Calcul du temps terminé avec succès
```

### Messages d'Erreur Possibles

#### Erreur 1: Volume = 0
```
⚠️ Volume est 0, impossible de calculer le temps
```
**Solution**: Le fichier STL n'a pas été analysé correctement. Vérifiez le format du fichier.

#### Erreur 2: Fonction Non Trouvée
```
✗ Fonction updateTimeEstimate non trouvée
```
**Solution**: Le script inline n'est pas chargé. Videz le cache du navigateur.

#### Erreur 3: Élément Non Trouvé
```
✗ Élément stlTime non trouvé
✗ Élément printHours non trouvé
✗ Élément printMinutes non trouvé
```
**Solution**: Le panneau des paramètres d'impression n'est pas affiché. Le fichier STL n'a peut-être pas été importé correctement.

#### Erreur 4: Erreur de Calcul
```
❌ Erreur calcul temps: [message d'erreur]
```
**Solution**: Problème dans l'algorithme de calcul. Notez le message d'erreur complet.

---

## 🧪 Tests à Effectuer

### Test 1: Import STL Basique
1. Ouvrez la console (F12)
2. Importez un fichier STL
3. **Copiez tous les messages** de la console
4. Partagez-les pour analyse

### Test 2: Vérification du Volume
Dans la console, tapez :
```javascript
console.log('Volume:', window.stlVolume);
```
✅ Devrait afficher un nombre > 0

### Test 3: Vérification de la Fonction
Dans la console, tapez :
```javascript
console.log('Fonction:', typeof window.updateTimeEstimate);
```
✅ Devrait afficher `"function"`

### Test 4: Appel Manuel
Dans la console, tapez :
```javascript
window.stlVolume = 50; // Définir un volume de test
window.updateTimeEstimate(); // Appeler la fonction
```
✅ Devrait calculer et afficher le temps

### Test 5: Vérification des Éléments
Dans la console, tapez :
```javascript
console.log('stlTime:', document.getElementById('stlTime'));
console.log('printHours:', document.getElementById('printHours'));
console.log('printMinutes:', document.getElementById('printMinutes'));
```
✅ Aucun ne devrait être `null`

---

## 🔧 Solutions Rapides

### Solution 1: Le Volume N'est Pas Calculé
**Symptôme**: `Volume est 0`

**Cause**: Le fichier STL n'est pas analysé correctement

**Solution**:
1. Essayez avec un autre fichier STL
2. Vérifiez que c'est bien un fichier `.stl` (binaire ou ASCII)
3. Vérifiez la taille du fichier (< 10 MB recommandé)

### Solution 2: Les Éléments N'Existent Pas
**Symptôme**: `Élément xxx non trouvé`

**Cause**: Le panneau des paramètres d'impression n'est pas affiché

**Solution**:
Vérifiez que cette section est bien dans `index.html` :
```html
<div id="stlInfo" class="mt-4 hidden">
    <p><strong>Temps estimé :</strong> <span id="stlTime"></span></p>
    ...
    <input id="layerHeight" ...>
    <input id="printSpeed" ...>
    ...
</div>
```

### Solution 3: La Fonction N'Est Pas Définie
**Symptôme**: `Fonction updateTimeEstimate non trouvée`

**Cause**: Le script inline n'est pas chargé

**Solution**:
1. **Videz le cache** : `Ctrl + Shift + R`
2. Vérifiez que le script inline existe dans `<head>` de `index.html`
3. Redéployez depuis Portainer

### Solution 4: Erreur JavaScript
**Symptôme**: `Erreur calcul temps: [erreur]`

**Cause**: Bug dans le code

**Solution**:
1. Notez le message d'erreur complet
2. Notez la ligne où l'erreur se produit
3. Partagez ces informations pour analyse

---

## 📋 Checklist de Vérification

Avant de signaler un problème, vérifiez :

- [ ] Le cache du navigateur a été vidé (`Ctrl + Shift + R`)
- [ ] La version Docker est 3.1.2 ou supérieure
- [ ] La console est ouverte (F12)
- [ ] Le fichier STL est bien un fichier `.stl` valide
- [ ] Les messages de la console ont été copiés
- [ ] Les tests ci-dessus ont été effectués

---

## 📸 Captures d'Écran à Fournir

Pour un diagnostic complet, faites des captures d'écran de :

1. **Console complète** après l'import STL
2. **Section "Import STL"** avec les informations affichées
3. **Champs "Heures" et "Minutes"**
4. **Section "Paramètres d'impression"** (si visible)

---

## 🚀 Prochaines Étapes

### Si Les Logs Montrent "✅ Calcul du temps terminé avec succès"
→ Le calcul fonctionne ! Le problème est ailleurs (affichage, mise à jour, etc.)

### Si Les Logs Montrent Une Erreur
→ Partagez le message d'erreur complet pour analyse

### Si Aucun Log N'Apparaît
→ La fonction n'est pas appelée. Le problème est dans `handleSTLUpload()`

---

**Version** : 3.1.2 (Debug)  
**Date** : 14 janvier 2026  
**Status** : 🔍 Version de diagnostic avec logs détaillés

**Une fois le problème identifié, nous pourrons le corriger rapidement !** 🎯
