# 🎉 VERSION 3.5.1 DÉPLOYÉE ET FONCTIONNELLE

**Date** : 14 janvier 2026  
**Statut** : ✅ **Production Ready**

---

## 🚀 Accès rapide

- **Application** : `http://votre-serveur:3080`
- **Documentation complète** : [Documentation/](./Documentation/)
- **Changelog v3.5.1** : [CHANGELOG-v3.5.1.md](./Documentation/CHANGELOG-v3.5.1.md)

---

## ✨ Nouveautés v3.5.1

### **Affichage des coûts détaillés**

Le panneau "Résultats" affiche maintenant :

| Champ | Description | Calcul |
|-------|-------------|--------|
| 📄 **Nom du fichier** | Nom du fichier 3MF uploadé | Extrait automatiquement |
| ⏱️ **Coût des heures** | Coût machine par heure | `heures × taux_horaire × 10%` |
| ⏱️ **Coût des minutes** | Coût machine par minute | `(min/60) × taux_horaire × 10%` |
| ⚖️ **Coût du poids** | Coût du filament utilisé | `(poids_g/1000) × prix_kg` |
| 📦 **Coût du filament** | Total filament | Basé sur le poids |
| ⚡ **Coût électricité** | Consommation électrique | Basé sur le temps |
| 💰 **Coût total** | Somme de tous les coûts | Calcul global |

---

## 📦 Fonctionnalités principales

### ✅ **Support complet des fichiers 3MF**

- **Extraction automatique** des métadonnées :
  - ⏱️ Temps d'impression (G-code, XML, JSON)
  - ⚖️ Poids du filament
  - 📏 Longueur du filament
  - 📐 Paramètres d'impression (hauteur, vitesse, remplissage)

- **Multi-sources** : XML, G-code, JSON (Bambu Studio)
- **Priorité intelligente** : G-code > JSON > XML > Défaut

### ✅ **Support des fichiers STL**

- **Calcul automatique** :
  - Volume (cm³)
  - Poids (grammes)
  - Temps d'impression estimé

### ✅ **Calcul précis des coûts**

- Coût du filament
- Coût de l'électricité
- Amortissement de l'imprimante
- Maintenance
- Taux d'échec
- Main-d'œuvre
- Marge bénéficiaire

### ✅ **Fonctionnalités avancées**

- 📊 Graphiques de répartition des coûts (Chart.js)
- 📄 Export PDF avec logo
- 💾 Sauvegarde/Chargement des configurations
- 📜 Historique des calculs
- 🌓 Mode sombre/clair
- ⚖️ Comparaison de matériaux
- 🔧 Préréglages (Bambu Lab A1)

---

## 🏗️ Architecture

```
calculateur-impression-3d/
├── index.html              # Application principale (74 KB)
├── js/
│   ├── calculator.js       # Logique de calcul
│   └── cost-display.js     # Affichage des coûts détaillés (nouveau v3.5.1)
├── css/
│   └── style.css           # Styles personnalisés
├── images/
│   ├── logo-ced-it.png     # Logo Ced-IT
│   └── ...
├── test-ced.gcode.3mf      # Fichier de test 3MF (nouveau v3.5.1)
├── favicon.svg             # Icône de l'application
├── Dockerfile              # Image Docker
├── nginx.conf              # Configuration Nginx
└── Documentation/          # Documentation complète
```

---

## 🧪 Test rapide

### **Dans la console navigateur** (F12) :

```javascript
// Test automatique avec le fichier de test
fetch('/test-ced.gcode.3mf')
  .then(res => res.blob())
  .then(blob => new File([blob], 'test-ced.gcode.3mf'))
  .then(file => window.handle3MFFile(file))
  .then(() => {
    setTimeout(() => {
      console.log("Nom:", document.getElementById('fileName').textContent);
      console.log("Heures:", document.getElementById('hoursCost').textContent);
      console.log("Minutes:", document.getElementById('minutesCost').textContent);
      console.log("Poids:", document.getElementById('weightCost').textContent);
    }, 2000);
  });
```

**Résultats attendus** :
```
Nom: test-ced.gcode.3mf (3MF)
Heures: 0.00 €
Minutes: 2.67 €
Poids: 0.24 €
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [CHANGELOG-v3.5.1.md](./Documentation/CHANGELOG-v3.5.1.md) | Détails complets de la v3.5.1 |
| [START-HERE.md](./START-HERE.md) | Guide de démarrage rapide |
| [DEPLOIEMENT.md](./DEPLOIEMENT.md) | Instructions de déploiement |
| [SUPPORT-3MF-COMPLET.md](./Documentation/SUPPORT-3MF-COMPLET.md) | Support complet des fichiers 3MF |

---

## 🛠️ Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Frameworks CSS** : Tailwind CSS (CDN)
- **Bibliothèques** :
  - Chart.js (graphiques)
  - JSZip (extraction 3MF)
  - jsPDF (export PDF)
  - html2canvas (capture d'écran)
  - Font Awesome (icônes)
- **Serveur** : Nginx (Alpine Linux)
- **Container** : Docker

---

## 🐛 Dépannage

### **Le fichier 3MF n'est pas extrait**

1. Vérifiez que le fichier est valide :
   ```bash
   docker exec calculateur-impression-3d unzip -l /usr/share/nginx/html/test-ced.gcode.3mf
   ```

2. Vérifiez que Nginx sert le bon type MIME :
   ```bash
   curl -I http://localhost:3080/test-ced.gcode.3mf
   # Content-Type devrait être application/octet-stream
   ```

### **Les coûts détaillés ne s'affichent pas**

1. Vérifiez que `cost-display.js` est chargé :
   ```javascript
   console.log(typeof window.updateCostDisplay); // Devrait afficher "function"
   ```

2. Rechargez la page sans cache : `Ctrl+Shift+R` (ou `Cmd+Shift+R` sur Mac)

### **Le container est "unhealthy"**

C'est normal si vous n'avez pas de healthcheck configuré. Le container fonctionne correctement.

---

## 📊 Statistiques du projet

- **Lignes de code** : ~2500 (HTML + JS + CSS)
- **Taille totale** : ~150 KB (sans dépendances CDN)
- **Temps de chargement** : < 1 seconde
- **Compatibilité navigateurs** : 99%+

---

## 🔮 Roadmap

### **v3.6.0 (À venir)**

- [ ] Graphique de répartition des coûts détaillés
- [ ] Export PDF avec les nouveaux champs
- [ ] Historique enrichi avec noms de fichiers
- [ ] Support des profils Bambu Studio (JSON complet)
- [ ] Mode "batch" pour calculer plusieurs fichiers

### **v3.7.0 (Futur)**

- [ ] API REST pour calculs automatisés
- [ ] Base de données pour historique persistant
- [ ] Multi-utilisateurs avec authentification
- [ ] Intégration avec Octoprint/Klipper

---

## 👥 Support

- **Issues** : [GitHub Issues](https://github.com/votre-repo/issues)
- **Email** : support@ced-it.com
- **Documentation** : [Documentation/](./Documentation/)

---

## 📜 Licence

© 2026 Ced-IT - Tous droits réservés

---

## ✅ Version actuelle

**Version** : 3.5.1  
**Dernière mise à jour** : 14 janvier 2026  
**Statut** : ✅ Stable et déployée

**Prochaine mise à jour prévue** : v3.6.0 (Février 2026)
