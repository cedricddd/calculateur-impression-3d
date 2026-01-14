# 🚀 Guide d'utilisation - Calculateur 3D v3.5.1

**Accès** : `http://votre-serveur:3080`

---

## 📤 **Uploader un fichier 3MF**

1. Cliquez sur **"Choisir un fichier"** dans la section "Import STL / 3MF"
2. Sélectionnez votre fichier 3MF (généré par Bambu Studio, PrusaSlicer, etc.)
3. Les données sont **automatiquement extraites** :
   - ⏱️ Temps d'impression
   - ⚖️ Poids du filament
   - 📐 Paramètres d'impression

---

## 📊 **Comprendre les résultats**

### **Panneau "Résultats" (à droite)**

| Champ | Signification |
|-------|---------------|
| **📄 Fichier** | Nom du fichier uploadé |
| **⏱️ Heures** | Coût des heures d'impression (machine) |
| **⏱️ Minutes** | Coût des minutes d'impression |
| **⚖️ Poids** | Coût du filament utilisé |
| **📦 Filament** | Coût total du filament |
| **⚡ Électricité** | Coût de la consommation électrique |
| **🔧 Amortissement** | Quote-part de l'imprimante |
| **🛠️ Maintenance** | Coût de l'entretien |
| **❌ Échecs** | Marge pour les impressions ratées |
| **👤 Main-d'œuvre** | Temps de préparation/finition |
| **💰 COÛT TOTAL** | Somme de tous les coûts |
| **💵 PRIX DE VENTE** | Prix avec marge bénéficiaire |

---

## 🔧 **Ajuster les paramètres**

### **Filament**
- **Type** : PLA, ABS, PETG, TPU...
- **Prix** : €/kg (ex: 20 €/kg)
- **Poids** : Rempli automatiquement depuis le 3MF
- **Densité** : g/cm³ (PLA: 1.24, ABS: 1.04)

### **Durée**
- **Heures/Minutes** : Remplies automatiquement depuis le 3MF
- **Temps total** : Calculé automatiquement

### **Coûts d'exploitation**
- **Consommation** : Wattage de l'imprimante (ex: 120W)
- **Prix électricité** : €/kWh (France: ~0.19 €)

### **Paramètres avancés** (cliquez pour développer)
- **Coût imprimante** : Prix d'achat (ex: 500 €)
- **Durée de vie** : Heures d'utilisation (ex: 5000h)
- **Maintenance** : €/heure (ex: 0.10 €)
- **Taux d'échec** : % d'impressions ratées (ex: 5%)
- **Marge bénéficiaire** : % de profit (ex: 30%)
- **Main-d'œuvre** : Temps + taux horaire

---

## 💾 **Sauvegarder sa configuration**

1. Cliquez sur **"Sauvegarder"**
2. Votre configuration est enregistrée dans le navigateur
3. Cliquez sur **"Charger"** pour la restaurer

---

## 📄 **Exporter en PDF**

1. Réglez tous les paramètres
2. Cliquez sur **"Calculer le coût"**
3. Cliquez sur **"PDF"**
4. Un devis PDF est généré avec :
   - Logo Ced-IT
   - Détails du projet
   - Répartition des coûts
   - Prix de vente suggéré

---

## 📜 **Consulter l'historique**

1. Cliquez sur **"Historique (X)"** en bas du panneau "Résultats"
2. Consultez vos anciens calculs
3. Cliquez sur un calcul pour le recharger
4. **"Effacer l'historique"** pour tout supprimer

---

## ⚖️ **Comparer des matériaux**

1. Faites défiler vers **"Comparaison de Matériaux"**
2. Cliquez sur **"Ajouter un matériau"**
3. Choisissez un matériau et un prix
4. Le tableau compare automatiquement :
   - Coût du filament
   - Coût total
   - Prix de vente

---

## 🎨 **Changer le thème**

Cliquez sur **"Mode Sombre"** / **"Mode Clair"** en haut à droite.

---

## 🐛 **Problèmes courants**

### **Le fichier 3MF ne s'upload pas**

- ✅ Vérifiez que c'est bien un fichier `.3mf`
- ✅ Essayez avec un fichier STL à la place
- ✅ Rechargez la page (F5)

### **Les données ne sont pas extraites**

- ✅ Votre fichier 3MF doit contenir des métadonnées
- ✅ Fichiers Bambu Studio : ✅ Parfaitement supportés
- ✅ Fichiers PrusaSlicer : ✅ Supportés
- ✅ Autres slicers : ⚠️ Partiellement supportés

### **Le calcul semble incorrect**

- ✅ Vérifiez les paramètres dans "Paramètres avancés"
- ✅ Ajustez le taux d'échec si nécessaire
- ✅ Vérifiez le prix du filament (€/kg, pas €/rouleau)

---

## 📞 **Support**

- **Email** : support@ced-it.com
- **Documentation** : `http://votre-serveur:3080/Documentation/`
- **Version actuelle** : 3.5.1

---

## ✨ **Astuces**

💡 **Astuce 1** : Utilisez le préréglage "Bambu Lab A1" pour des valeurs par défaut optimisées

💡 **Astuce 2** : Sauvegardez plusieurs configurations (PLA, ABS, PETG) et chargez-les selon le matériau

💡 **Astuce 3** : Ajustez la marge bénéficiaire selon votre marché (20-50% typiquement)

💡 **Astuce 4** : Le coût des heures/minutes est calculé à 10% du taux horaire de main-d'œuvre (coût machine)

---

**Bonne impression ! 🎨🖨️**
