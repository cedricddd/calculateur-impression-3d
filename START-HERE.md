# 🚀 START HERE - Calculateur d'Impression 3D v3.5.1

**Dernière mise à jour** : 14 janvier 2026, 21:30  
**Version actuelle** : 3.5.1 ✨  
**Statut** : 🟢 **Production - Stable**

---

## ✅ **NOUVEAUTÉ v3.5.1 : Affichage des coûts détaillés**

Le panneau "Résultats" affiche maintenant :
- 📄 **Nom du fichier 3MF**
- ⏱️ **Coût des heures** d'impression
- ⏱️ **Coût des minutes** d'impression
- ⚖️ **Coût du poids** du filament

**Plus de détails** : [Documentation/CHANGELOG-v3.5.1.md](Documentation/CHANGELOG-v3.5.1.md)

---

## 🎯 **ACCÈS RAPIDE**

**URL** : `http://votre-serveur:3080`

**Test rapide** (Console F12) :
```javascript
fetch('/test-ced.gcode.3mf')
  .then(r => r.blob())
  .then(b => new File([b], 'test.3mf'))
  .then(f => window.handle3MFFile(f))
```

---

## 🧪 **TEST SANS DÉPLOIEMENT**

Ouvrez directement : `test-3mf-simple.html`

✅ Testez le support 3MF **immédiatement**  
✅ Glissez un fichier 3MF ou STL  
✅ Console de debug intégrée  
✅ **Aucun déploiement nécessaire !**

---

## ✨ **FONCTIONNALITÉS PRINCIPALES**

### **1. Support complet des fichiers 3MF**
- ✅ Extraction depuis **G-code** (prioritaire)
- ✅ Extraction depuis **JSON** (Bambu Studio)
- ✅ Extraction depuis **XML** (métadonnées)
- ✅ Compatible : Bambu Studio, PrusaSlicer, Cura
- ✅ Fichiers MakerWorld et Printables

**Données extraites** :
- ⏱️ Temps d'impression (avec heures + minutes)
- ⚖️ Poids du filament
- 📏 Longueur du filament
- 📐 Hauteur de couche
- 🏃 Vitesse d'impression
- 📊 Taux de remplissage

### **2. Support des fichiers STL**
- ✅ Calcul automatique du volume
- ✅ Estimation du poids
- ✅ Estimation du temps d'impression

### **3. Calcul précis des coûts**
- 📦 Coût du filament
- ⚡ Coût de l'électricité
- 🔧 Amortissement de l'imprimante
- 🛠️ Maintenance
- ❌ Marge d'erreur (taux d'échec)
- 👤 Main-d'œuvre
- 💰 Marge bénéficiaire

### **4. Fonctionnalités avancées**
- 📊 Graphiques (Chart.js)
- 📄 Export PDF
- 💾 Sauvegarde/Chargement
- 📜 Historique
- 🌓 Mode sombre/clair
- ⚖️ Comparaison de matériaux
- 🔧 Préréglages (Bambu Lab A1)

---

## 📦 **DÉPLOIEMENT**

### **Option 1 : Container déjà actif**

Si le container `calculateur-impression-3d` existe déjà :

```bash
# Vérifier le container
docker ps | grep calculateur

# Recharger la configuration
docker exec calculateur-impression-3d nginx -s reload

# Tester
curl -I http://localhost:3080/test-ced.gcode.3mf
```

### **Option 2 : Nouveau déploiement**

```bash
# 1. Cloner le projet
git clone https://github.com/votre-repo/calculateur-3d.git
cd calculateur-3d

# 2. Build et démarrage
docker compose build
docker compose up -d

# 3. Vérifier
docker compose logs -f
```

### **Option 3 : Portainer**

1. Portainer → Stacks → **calculateur-impression-3d**
2. Cliquez sur **"Pull and redeploy"**
3. Attendez 30 secondes
4. **Vider le cache navigateur** : `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

---

## 🧪 **TESTER L'APPLICATION**

### **1. Test manuel**

1. Allez sur `http://votre-serveur:3080`
2. Cliquez sur **"Choisir un fichier"**
3. Uploadez un fichier 3MF (Bambu Studio, PrusaSlicer...)
4. Vérifiez que le panneau "Résultats" affiche :
   - ✅ Nom du fichier
   - ✅ Coût des heures
   - ✅ Coût des minutes
   - ✅ Coût du poids
   - ✅ Coût total

### **2. Test automatique (Console F12)**

```javascript
// Test avec le fichier de test intégré
fetch('/test-ced.gcode.3mf')
  .then(res => res.blob())
  .then(blob => new File([blob], 'test.3mf'))
  .then(file => window.handle3MFFile(file))
  .then(() => {
    setTimeout(() => {
      console.log("Nom:", document.getElementById('fileName').textContent);
      console.log("Heures:", document.getElementById('hoursCost').textContent);
      console.log("Minutes:", document.getElementById('minutesCost').textContent);
      console.log("Poids:", document.getElementById('weightCost').textContent);
      console.log("Total:", document.getElementById('totalCost').textContent);
    }, 2000);
  });
```

**Résultats attendus** :
```
Nom: test.3mf
Heures: 0.00 €
Minutes: 2.67 €
Poids: 0.24 €
Total: 26.63 €
```

### **3. Console de debug**

Ouvrez la console (F12) et observez les logs détaillés :

```
🔓 Décompression du fichier 3MF...
✅ Fichier ZIP chargé, fichiers trouvés: 4
📄 Lecture du fichier: 3D/3dmodel.model
📊 Métadonnées XML extraites: {print_time: '1920', filament_weight: '12.04'}
📄 Lecture du fichier G-code: Metadata/plate_1.gcode
📊 Données extraites depuis le G-code: {model_time: '32m 19s', weight: 12.04}
🎯 Données extraites:
  ⏱️ Temps: 1939 secondes (32 minutes)
  ⚖️ Poids filament: 12.04 g
✅ Extraction 3MF terminée avec succès
📊 Coûts affichés: {heures: '0.00 €', minutes: '2.67 €', poids: '0.24 €'}
```

---

## 📚 **DOCUMENTATION**

| Document | Description |
|----------|-------------|
| [README.md](README.md) | Vue d'ensemble complète |
| [GUIDE-UTILISATEUR.md](Documentation/GUIDE-UTILISATEUR.md) | Guide pour les utilisateurs |
| [CHANGELOG-v3.5.1.md](Documentation/CHANGELOG-v3.5.1.md) | Détails techniques v3.5.1 |
| [MESSAGE-FINAL-V3.5.1.md](Documentation/MESSAGE-FINAL-V3.5.1.md) | Résumé du déploiement |
| [SUPPORT-3MF-COMPLET.md](Documentation/SUPPORT-3MF-COMPLET.md) | Support 3MF complet |

---

## 🐛 **DÉPANNAGE**

### **Le fichier 3MF ne s'upload pas**

```bash
# Vérifier que le fichier test existe
docker exec calculateur-impression-3d ls -lh /usr/share/nginx/html/test-ced.gcode.3mf

# Vérifier le type MIME
curl -I http://localhost:3080/test-ced.gcode.3mf
# Doit retourner: Content-Type: application/octet-stream
```

### **Les coûts détaillés ne s'affichent pas**

```javascript
// Vérifier que cost-display.js est chargé
console.log(typeof window.updateCostDisplay); // Doit afficher "function"

// Forcer le rechargement
window.location.reload(true);
```

### **Cache navigateur**

Si vous voyez une ancienne version :

- **Windows** : `Ctrl + Shift + R`
- **Mac** : `Cmd + Shift + R`
- **Ou** : F12 > Application > Clear storage > Clear site data

---

## 🔮 **PROCHAINES VERSIONS**

### **v3.6.0 (Février 2026)**
- [ ] Export PDF avec coûts détaillés
- [ ] Graphique "Répartition détaillée"
- [ ] Historique enrichi avec noms de fichiers
- [ ] Mode "batch" pour plusieurs fichiers

### **v4.0.0 (Mars 2026)**
- [ ] API REST
- [ ] Multi-utilisateurs
- [ ] Base de données persistante
- [ ] Intégration Octoprint/Klipper

---

## 📞 **SUPPORT**

- **Email** : support@ced-it.com
- **Documentation** : [Documentation/](Documentation/)
- **URL** : `http://votre-serveur:3080`

---

## ✅ **CHECKLIST DE VALIDATION**

Avant de considérer le déploiement réussi :

- [ ] Container Docker actif (`docker ps`)
- [ ] Application accessible (`http://votre-serveur:3080`)
- [ ] Upload 3MF fonctionne
- [ ] Extraction des données OK (console F12)
- [ ] Panneau "Résultats" affiche tous les champs
- [ ] Export PDF fonctionne
- [ ] Mode sombre/clair fonctionne
- [ ] Historique fonctionne
- [ ] Sauvegarde/Chargement fonctionne

---

**Version** : 3.5.1  
**Date** : 14 janvier 2026  
**Statut** : 🟢 **Production Ready**

**Développé avec ❤️ par Ced-IT**
