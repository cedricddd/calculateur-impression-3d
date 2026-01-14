# Calculateur de Prix d'Impression 3D

Un outil web complet et intuitif pour calculer précisément le coût de vos impressions 3D, incluant tous les paramètres importants : filament, électricité, amortissement, maintenance et marge bénéficiaire.

## 🎯 Fonctionnalités actuellement complétées

### ✅ Mode Sombre
- **Toggle mode sombre/clair** : Bouton en haut à droite pour basculer entre les thèmes
- **Persistance** : Le thème sélectionné est sauvegardé dans le navigateur
- **Design adapté** : Toute l'interface s'adapte au thème sombre
- **Confort visuel** : Réduit la fatigue oculaire lors d'utilisation prolongée

### ✅ Import STL
- **Upload de fichiers** : Glisser-déposer ou sélection de fichier STL
- **Analyse automatique** : Calcul du volume et estimation du poids
- **Support binaire et ASCII** : Compatible avec les deux formats STL
- **Mise à jour automatique** : Le poids estimé est appliqué au formulaire
- **Affichage des informations** : Nom du fichier, volume (cm³), poids estimé (g)

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

### Page principale
- **URI** : `/index.html` ou `/`
- **Description** : Interface complète du calculateur
- **Paramètres** : Aucun (tous les paramètres sont saisis via l'interface)

### Fichiers JavaScript
- **URI** : `/js/calculator.js`
- **Description** : Logique de calcul, gestion de l'interface, présets, historique et export PDF

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

Pour déployer ce projet :
1. Allez dans l'onglet **Publish**
2. Cliquez sur le bouton de publication
3. Votre calculateur sera accessible via l'URL fournie

---

**Dernière mise à jour** : 2026-01-14
**Version** : 3.0.0  
**Licence** : MIT

## 🎉 Changelog

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