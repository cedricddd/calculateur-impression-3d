# Calculateur de Prix d'Impression 3D

Un outil web complet et intuitif pour calculer précisément le coût de vos impressions 3D, incluant tous les paramètres importants : filament, électricité, amortissement, maintenance et marge bénéficiaire.

**🔥 Version 3.4.0** - Extraction Complète depuis JSON/Config 🎉

## 🧪 Test Rapide (Nouveau !)

**Testez immédiatement sans déploiement** :
```bash
# Ouvrez simplement test-3mf-simple.html dans un navigateur
```

✅ **Console de debug intégrée**  
✅ **Interface visuelle complète**  
✅ **Support STL et 3MF**  
✅ **Voir toutes les métadonnées extraites**

📖 **Mode d'emploi** : [TEST-3MF-MODE-EMPLOI.md](TEST-3MF-MODE-EMPLOI.md)

---

## 🚀 Déploiement Rapide

### Tester localement
```bash
# Ouvrir simplement index.html dans un navigateur
```

### Déployer sur Docker/Portainer
Consultez [DEPLOIEMENT-RAPIDE.md](DEPLOIEMENT-RAPIDE.md) pour un guide en 2 minutes !

### Tester automatiquement
- **test-3mf-simple.html** : Page de test autonome avec console intégrée (recommandé)
- **test-auto.html** : Tests automatiques complets
- **test-diagnostic.html** : Diagnostic détaillé du système

## 🎯 Fonctionnalités actuellement complétées

### ✨ NOUVEAU - Extraction Complète 3MF (v3.4.0) 🎉
- **📦 3 sources de données** : Extraction depuis JSON, Config ET XML
- **🎯 Ordre de priorité intelligent** : JSON → Config → XML → Défaut
- **✅ Fichiers MakerWorld** : Support complet des fichiers téléchargés
- **⏱️ Temps exact** : Extraction depuis `plate_X.json` (prediction ou print_time)
- **⚖️ Poids exact** : Extraction depuis `filament_used_g` ou `weight`
- **📏 Longueur exacte** : Extraction depuis `filament_used_mm`
- **⚙️ Paramètres complets** : Extraction depuis `slice_info.config`
- **🔍 Logs détaillés** : Voir exactement d'où viennent les données
- **📖 Documentation** : [EXTRACTION-JSON-CONFIG.md](EXTRACTION-JSON-CONFIG.md)

### ✨ Estimation du Temps d'Impression (v3.1.0)
- **⏱️ Calcul automatique du temps** : Estimation du temps d'impression depuis le fichier STL
- **⚙️ Paramètres personnalisables** : Hauteur de couche, vitesse, remplissage, supports
- **📊 Mise à jour en temps réel** : Modifiez les paramètres et le temps se recalcule instantanément
- **🎯 Estimation intelligente** : Prend en compte les périmètres, le remplissage et les supports
- **🔄 Intégration automatique** : Les champs heures/minutes sont remplis automatiquement
- **📖 Documentation complète** : Voir [ESTIMATION-TEMPS.md](ESTIMATION-TEMPS.md)

### ✅ Mode Sombre (v3.0.1 - Corrigé pour Docker)
- **Toggle mode sombre/clair** : Bouton en haut à droite pour basculer entre les thèmes
- **Persistance** : Le thème sélectionné est sauvegardé dans le navigateur
- **Design adapté** : Toute l'interface s'adapte au thème sombre
- **Confort visuel** : Réduit la fatigue oculaire lors d'utilisation prolongée
- **✅ Fonctionne en Docker** : Script inline pour chargement immédiat

### ✅ Import STL / 3MF (v3.4.0 - Extraction Complète) 🎉
- **Upload de fichiers** : Glisser-déposer ou sélection de fichier STL ou 3MF
- **STL complet** : Analyse automatique du volume et estimation du poids
- **✨ 3MF ultra-complet** : Extraction depuis 3 sources !
  - 📦 **JSON** : plate_X.json (temps, poids, longueur exacts)
  - ⚙️ **Config** : slice_info.config (paramètres de tranchage)
  - 📄 **XML** : 3dmodel.model (métadonnées standard)
  - ⏱️ Temps d'impression réel (depuis le slicer)
  - ⚖️ Poids de filament exact
  - 📏 Longueur de filament
  - 📐 Hauteur de couche
  - 🏃 Vitesse d'impression
  - 📊 Taux de remplissage
- **Remplissage automatique** : Tous les champs sont pré-remplis avec les valeurs du slicer
- **Support binaire et ASCII** : Compatible avec les deux formats STL
- **Compatibilité slicers** : PrusaSlicer, Bambu Studio, Cura, Simplify3D
- **✅ Fichiers MakerWorld** : Extraction complète même sans tranchage local
- **✅ Fonctionne en Docker** : JSZip intégré via CDN
- **📖 Documentation** : [SUPPORT-3MF-COMPLET.md](SUPPORT-3MF-COMPLET.md) et [EXTRACTION-JSON-CONFIG.md](EXTRACTION-JSON-CONFIG.md)

### ✅ Comparaison de Matériaux
- **Tableau comparatif** : Comparez plusieurs matériaux côte à côte
- **Ajout facile** : Bouton pour ajouter le matériau actuel à la comparaison
- **Détails complets** : Prix, densité, coût filament, coût total, prix de vente
- **Gestion** : Suppression individuelle de chaque matériau
- **Vue d'ensemble** : Identifiez rapidement le meilleur rapport qualité/prix

### ✅ Calculs de base
- **Coût du filament** : Calcul basé sur le prix au kg et le poids utilisé
- **Coût de l'électricité** : Basé sur la consommation de l'imprimante et le temps d'impression
- **Temps d'impression** : Saisie en heures et minutes avec affichage du temps total

### ✅ Paramètres avancés
- **Amortissement de l'imprimante** : Calcul basé sur le coût d'achat et la durée de vie estimée
- **Maintenance** : Coût de maintenance par heure d'impression
- **Taux d'échec** : Prise en compte des impressions ratées
- **Main-d'œuvre** : Durée en heures et taux horaire (par défaut : 0.5h × 50€/h)
- **Marge bénéficiaire** : Calcul automatique du prix de vente suggéré

### ✅ Présets d'imprimantes
- **Bambu Lab A1** (299€, 100W, 5000h) - Un bouton pour charger rapidement les paramètres

### ✅ Gestion de configurations
- **Sauvegarde** : Enregistrez vos paramètres dans le navigateur
- **Chargement** : Récupérez vos configurations sauvegardées
- **Réinitialisation** : Retour aux valeurs par défaut

### ✅ Export et historique
- **Export PDF** : Générez un rapport détaillé de vos calculs
- **Historique** : Consultez les 50 derniers calculs effectués
- **Notifications** : Retours visuels pour toutes les actions

### ✅ Visualisation graphique
- **Graphique circulaire** : Visualisation interactive de la répartition des coûts avec Chart.js
- **Couleurs distinctives** : Chaque poste de coût est facilement identifiable
- **Mise à jour en temps réel** : Le graphique se met à jour automatiquement

### ✅ Types de filaments supportés
- PLA (densité 1.24 g/cm³)
- ABS (densité 1.04 g/cm³)
- PETG (densité 1.27 g/cm³)
- TPU (densité 1.21 g/cm³)
- Nylon (densité 1.14 g/cm³)
- Polycarbonate/PC (densité 1.20 g/cm³)
- ASA (densité 1.07 g/cm³)
- Autre (densité personnalisable)

### ✅ Interface utilisateur
- Design moderne avec Tailwind CSS
- Interface responsive (mobile, tablette, desktop)
- Animations fluides pour les résultats
- Tooltips informatifs sur tous les paramètres
- Panneau de paramètres avancés pliable/dépliable
- Calcul automatique en temps réel
- Icônes Font Awesome pour une meilleure lisibilité
- Modal pour l'historique des calculs

### ✅ Affichage des résultats
- **Coût total** : Affichage proéminent du coût final avec animation
- **Détails par poste** : Répartition claire de tous les coûts
- **Prix de vente suggéré** : Avec marge bénéficiaire appliquée
- **Détail main-d'œuvre** : Affichage du calcul (durée × taux horaire)
- **Statistiques supplémentaires** :
  - Coût par gramme
  - Coût par heure
  - Volume calculé en cm³
- **Graphique de répartition** : Visualisation des coûts

## 📋 URIs fonctionnels

### Pages principales
- **URI** : `/index.html` ou `/`
  - **Description** : Interface complète du calculateur
  - **Paramètres** : Aucun (tous les paramètres sont saisis via l'interface)

- **URI** : `/test-auto.html`
  - **Description** : Page de tests automatiques
  - **Usage** : Vérifie que toutes les fonctions critiques sont disponibles
  - **Tests** : LocalStorage, toggleTheme, handleSTLUpload, Chart.js, jsPDF, thème, DOM

- **URI** : `/test-diagnostic.html`
  - **Description** : Page de diagnostic manuel
  - **Usage** : Tests interactifs pour déboguer des problèmes

### Fichiers JavaScript
- **URI** : `/js/calculator.js`
  - **Description** : Logique de calcul, gestion de l'interface, présets, historique et export PDF
  - **Fonctions exposées globalement** : calculateCost, toggleTheme, handleSTLUpload, clearSTL, exportPDF, loadPreset, etc.

## 🎨 Technologies utilisées

- **HTML5** : Structure sémantique
- **Tailwind CSS** (via CDN) : Framework CSS moderne
- **Font Awesome** (via CDN) : Icônes
- **Chart.js** (via CDN) : Graphiques interactifs
- **jsPDF** (via CDN) : Génération de PDF
- **JavaScript ES6+** : Logique de calcul et interactivité
- **LocalStorage API** : Sauvegarde des configurations et historique

## 📊 Formules de calcul

### Coût du filament
```
Coût filament = (Poids en grammes / 1000) × Prix au kg
```

### Coût de l'électricité
```
Consommation (kWh) = (Puissance en W / 1000) × Temps en heures
Coût électricité = Consommation × Prix par kWh
```

### Amortissement de l'imprimante
```
Coût amortissement = (Coût imprimante / Durée de vie en heures) × Temps d'impression
```

### Coût de maintenance
```
Coût maintenance = Coût maintenance/heure × Temps d'impression
```

### Coût de la main-d'œuvre
```
Coût main-d'œuvre = Durée main-d'œuvre (heures) × Taux horaire
```

### Coût des échecs
```
Coût échecs = Coût de base × (Taux d'échec / 100)
```

### Coût total
```
Coût total = Filament + Électricité + Amortissement + Maintenance + Main-d'œuvre + Échecs
```

### Prix de vente suggéré
```
Prix de vente = Coût total × (1 + Marge bénéficiaire / 100)
```

## 🚀 Fonctionnalités non encore implémentées

### Fonctionnalités futures potentielles
- [ ] **Multi-langue** : Support de plusieurs langues (actuellement en français)
- [ ] **Calcul par projet** : Gérer plusieurs pièces dans un même projet
- [ ] **Base de données des filaments** : Prix moyens du marché par type
- [ ] **Calculateur de rentabilité** : ROI de l'imprimante 3D
- [ ] **Support de plusieurs devises** : Conversion automatique
- [ ] **Partage de calculs** : Générer des liens partageables
- [ ] **Analyse STL avancée** : Estimation plus précise avec Three.js
- [ ] **Graphiques d'évolution** : Suivi des coûts dans le temps
- [ ] **Export CSV** : Export de l'historique en format CSV
- [ ] **Prédiction temps d'impression** : Estimation basée sur la géométrie STL

## 🔧 Étapes de développement recommandées

### Priorité haute
1. **Analyse STL avancée** : Utiliser Three.js pour une estimation plus précise du volume
2. **Base de données de prix** : Intégrer une base de données de prix de filaments
3. **Multi-langue** : Support de l'anglais et de l'espagnol

### Priorité moyenne
4. **Calcul par projet** : Gérer plusieurs pièces simultanément
5. **Prédiction du temps d'impression** : Basé sur la géométrie STL et les paramètres
6. **Export avancé** : Templates PDF personnalisables

### Priorité basse
7. **Partage de calculs** : Générer des URLs partageables
8. **Graphiques d'évolution** : Suivi historique des coûts
9. **API REST** : Permettre l'intégration avec d'autres outils

## 📱 Compatibilité

- ✅ Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- ✅ Responsive design (mobile, tablette, desktop)
- ✅ Pas de dépendances serveur (100% client-side)

## 💡 Utilisation

1. **Ouvrez le fichier** `index.html` dans votre navigateur
2. **Saisissez vos paramètres** :
   - Type de filament et prix
   - Poids à utiliser
   - Temps d'impression
   - Consommation électrique
3. **Utilisez les présets** : Cliquez sur un preset d'imprimante populaire pour charger ses paramètres
4. **Développez les paramètres avancés** si besoin (imprimante, maintenance, marge, etc.)
5. Le calcul se met à jour automatiquement
6. **Consultez les résultats** et le graphique de répartition
7. **Actions disponibles** :
   - 💾 **Sauvegarder** : Enregistrez votre configuration
   - 📂 **Charger** : Récupérez votre configuration
   - 🔄 **Réinitialiser** : Retour aux valeurs par défaut
   - 📄 **PDF** : Exportez un rapport détaillé
   - 📜 **Historique** : Consultez vos calculs précédents

## 🎓 Valeurs par défaut

- **PLA** : 20 €/kg, densité 1.24 g/cm³
- **Poids** : 100g
- **Temps** : 5h30
- **Consommation** : 120W
- **Électricité** : 0.19 €/kWh (moyenne France)
- **Imprimante** : 500 €, durée de vie 5000h
- **Maintenance** : 0.10 €/h
- **Taux d'échec** : 5%
- **Marge** : 30%
- **Durée main-d'œuvre** : 0.5h
- **Taux horaire main-d'œuvre** : 50 €/h

## 📝 Notes

- Les densités de filament sont ajustées automatiquement selon le type sélectionné
- La durée de main-d'œuvre est définie manuellement (préparation, post-traitement, etc.)
- Le taux horaire de main-d'œuvre est défini à 50€/h par défaut
- Tous les coûts sont calculés en temps réel avec mise à jour automatique
- Les valeurs par défaut peuvent être modifiées selon vos besoins
- Les configurations et l'historique sont sauvegardés dans le navigateur (LocalStorage)
- L'historique conserve les 50 derniers calculs
- Le graphique se met à jour automatiquement à chaque modification
- Les notifications confirment chaque action effectuée
- Un seul preset disponible : **Bambu Lab A1** (299€, 100W)

## 🌐 Déploiement

### Local
1. **Ouvrez** `index.html` dans votre navigateur
2. C'est tout ! Aucune installation requise

### Docker/Portainer
Consultez les guides détaillés :
- **🚀 Guide rapide (2 minutes)** : [DEPLOIEMENT-RAPIDE.md](DEPLOIEMENT-RAPIDE.md)
- **📖 Guide complet Portainer** : [DEPLOIEMENT-PORTAINER.md](DEPLOIEMENT-PORTAINER.md)
- **🐛 Guide de dépannage** : [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **🔧 Correctif Docker v3.0.1** : [CORRECTIF-DOCKER.md](CORRECTIF-DOCKER.md)

### Tests
- **🧪 Test simple (recommandé)** : Ouvrez `test-3mf-simple.html` - Console intégrée, interface visuelle
- **🤖 Test automatique** : Ouvrez `test-auto.html` - 8 tests automatiques
- **🔧 Test diagnostic** : Ouvrez `test-diagnostic.html` - Tests manuels détaillés

**Important** : Après un déploiement Docker, pensez à vider le cache de votre navigateur !

---

**Dernière mise à jour** : 2026-01-14  
**Version** : 3.4.0  
**Licence** : MIT

## 🎉 Changelog

### v3.4.0 (2026-01-14) - Extraction Complète JSON/Config 🎯
- ✨ **3 sources de données** : Extraction depuis JSON, Config ET XML
- 📦 **Fichier JSON** : Lecture de `Metadata/plate_X.json` pour temps/poids/longueur exacts
- ⚙️ **Fichier Config** : Lecture de `Metadata/slice_info.config` pour paramètres de tranchage
- 🎯 **Ordre de priorité** : JSON (priorité haute) → Config → XML → Défaut
- ✅ **Fichiers MakerWorld** : Support complet des fichiers téléchargés (avec métadonnées)
- 🔍 **Logs améliorés** : Affiche exactement d'où viennent les données
- 📊 **Formats multiples** : Support "5h 23m", secondes, pourcentages, décimaux
- 🎉 **Résultat** : Extraction maximale même sans tranchage local !
- 📖 **Documentation** : Guide complet dans [EXTRACTION-JSON-CONFIG.md](EXTRACTION-JSON-CONFIG.md)

### v3.3.1 (2026-01-14) - Fichier de Test Simple + Favicon 🧪
- ✨ **Nouveau fichier de test** : `test-3mf-simple.html` - Page autonome pour tester sans déploiement
- 🎨 **Console intégrée** : Voir tous les logs directement dans la page
- 📊 **Interface visuelle** : Résultats affichés avec mise en page claire
- 🧪 **Test STL et 3MF** : Support des deux formats dans une seule page
- 🎯 **Debug simplifié** : Diagnostic complet sans ouvrir F12
- 🖼️ **Favicon ajouté** : Plus d'erreur 404 dans la console
- 📖 **Documentation** : Guide détaillé dans [TEST-3MF-MODE-EMPLOI.md](TEST-3MF-MODE-EMPLOI.md)
- 📋 **Résumé complet** : [RESUME-V3.3.1.md](RESUME-V3.3.1.md)

### v3.3.0 (2026-01-14) - Support Complet des Fichiers 3MF 🎉
- ✨ **Extraction des métadonnées 3MF** : Lecture complète des fichiers 3MF
- 🔓 **Décompression automatique** : JSZip intégré pour lire les fichiers ZIP
- ⏱️ **Temps d'impression réel** : Extrait depuis le slicer (PrusaSlicer, Bambu Studio, etc.)
- ⚖️ **Poids exact** : Poids de filament réel depuis le slicer
- 📐 **Paramètres d'impression** : Hauteur de couche, vitesse, remplissage extraits automatiquement
- 🔄 **Remplissage automatique** : Tous les champs sont pré-remplis avec les valeurs exactes
- 🎯 **Calcul précis** : Coût calculé avec les valeurs réelles du slicer
- 📖 **Documentation complète** : Guide détaillé dans [SUPPORT-3MF-COMPLET.md](SUPPORT-3MF-COMPLET.md)

### v3.2.0 (2026-01-14) - Support des Fichiers 3MF 📦
- ✨ **Support 3MF** : Détection automatique des fichiers 3MF
- ℹ️ **Message informatif** : L'utilisateur est informé que le support complet arrive bientôt
- ✅ **Validation de format** : Message d'erreur pour les formats non supportés
- 🔍 **Logs améliorés** : Debug détaillé pour STL et 3MF
- 📖 **Documentation** : Guide complet dans [SUPPORT-3MF.md](SUPPORT-3MF.md)
- 🚀 **Prochainement** : Extraction des métadonnées 3MF (temps, paramètres, etc.)

### v3.1.2 (2026-01-14) - Version Debug 🔍
- 🐛 **Logs de debug** : Ajout de logs détaillés pour diagnostiquer les problèmes de calcul de temps
- 📊 **Messages console** : Suivi complet de l'exécution (volume, paramètres, calculs, mise à jour)
- 🔧 **Diagnostic** : Guide de debug dans [DEBUG-TEMPS.md](DEBUG-TEMPS.md)

### v3.1.1 (2026-01-14) - Correctif Mise à Jour des Champs 🐛
- 🐛 **Fix Champs Heures/Minutes** : Les champs se remplissent maintenant automatiquement après l'import STL
- 🐛 **Fix Temps Total** : L'affichage "Temps total" se met à jour correctement
- 🔧 **Fix Événements** : Déclenchement automatique des événements `input` pour mettre à jour l'interface
- ⏱️ **Fix Délai** : Ajout d'un délai de sécurité pour s'assurer que tout est chargé
- 📝 **Documentation** : Guide de correctif dans [CORRECTIF-V3.1.1.md](CORRECTIF-V3.1.1.md)

### v3.1.0 (2026-01-14) - Estimation Automatique du Temps d'Impression ⏱️
- ✨ **Estimation du temps d'impression** : Calcul automatique depuis le fichier STL
- ⚙️ **Paramètres d'impression** : Hauteur de couche, vitesse, remplissage, supports
- 📊 **Algorithme intelligent** : Prise en compte des périmètres, remplissage et supports
- 🔄 **Mise à jour automatique** : Les champs heures/minutes sont remplis automatiquement
- 🎯 **Recalcul en temps réel** : Modifiez les paramètres et le temps se met à jour
- 📖 **Documentation complète** : Guide détaillé dans [ESTIMATION-TEMPS.md](ESTIMATION-TEMPS.md)

### v3.0.1 (2026-01-14) - Correctif Docker/Portainer
- 🐛 **Fix Mode sombre** : Ajout d'un script inline pour chargement immédiat
- 🐛 **Fix Import STL** : Analyse STL simplifiée sans dépendance Three.js
- 🐛 **Fix ReferenceError** : toggleTheme et handleSTLUpload maintenant disponibles immédiatement
- ✨ **Tests automatiques** : Nouvelle page `test-auto.html` pour vérifier le fonctionnement
- 📝 **Documentation** : Guides de déploiement et dépannage améliorés
- 🔧 **Docker** : Version mise à jour dans docker-compose.yml

### v3.0.0 (2026-01-14) - Mise à jour majeure
- ✨ **Mode sombre** : Toggle pour basculer entre thème clair et sombre
- ✨ **Import STL** : Upload et analyse automatique des fichiers STL
- ✨ **Comparaison de matériaux** : Tableau comparatif pour plusieurs filaments
- 🎨 Interface améliorée avec support du thème sombre
- 📊 Analyse automatique du volume et estimation du poids depuis fichiers STL
- 🔄 Système de comparaison côte à côte pour optimiser le choix de matériau

### v2.1.0 (2026-01-13)
- ✅ Simplification des présets : **uniquement Bambu Lab A1**
- ✅ Ajout du champ **"Durée main-d'œuvre"** en heures
- ✅ Taux horaire main-d'œuvre modifié à **50€/h**
- ✅ Affichage détaillé du coût main-d'œuvre (durée × taux)
- 🔧 Calcul de main-d'œuvre basé sur la durée définie (et non plus 10% du temps d'impression)

### v2.0.0 (2026-01-13)
- ✅ Présets pour 8 imprimantes populaires
- ✅ Sauvegarde/chargement de configurations personnalisées
- ✅ Export PDF des calculs avec mise en page professionnelle
- ✅ Historique des 50 derniers calculs avec gestion complète
- ✅ Graphique circulaire interactif de répartition des coûts (Chart.js)
- ✅ Système de notifications pour toutes les actions
- ✅ Boutons d'action rapide (Sauvegarder, Charger, Réinitialiser, PDF)
- ✅ Modal pour la consultation de l'historique

### 🔧 Améliorations continues
- Interface utilisateur enrichie avec plus d'actions disponibles
- Meilleure organisation des boutons et actions
- Animations et transitions plus fluides
- Retours visuels pour toutes les interactions utilisateur
- Thème sombre pour réduire la fatigue oculaire