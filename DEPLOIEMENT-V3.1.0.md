# 🚀 Version 3.1.0 - Déploiement Rapide

## ✨ Nouvelle Fonctionnalité

**Estimation automatique du temps d'impression depuis STL** ⏱️

Quand vous importez un fichier STL, le calculateur estime maintenant automatiquement :
- ⏱️ **Temps d'impression** (heures et minutes)
- 📏 Paramètres personnalisables (hauteur, vitesse, remplissage, supports)
- 🔄 Recalcul en temps réel

---

## 🚀 Déployer Maintenant (3 minutes)

### 1️⃣ Push GitHub
```bash
git add .
git commit -m "Feat: Estimation automatique du temps d'impression (v3.1.0)"
git push origin main
```

### 2️⃣ Redéployer Portainer
1. Portainer → Stacks → calculateur-impression-3d
2. Cliquez "**Pull and redeploy**"
3. Attendez 30 secondes

### 3️⃣ Vider le Cache
- **Windows** : `Ctrl + Shift + R`
- **Mac** : `Cmd + Shift + R`

---

## 🧪 Tester la Nouvelle Fonctionnalité

### Test 1 : Import STL Simple
1. Allez sur : http://192.168.1.124:3080
2. Glissez un fichier `.stl` dans la zone "Import STL"
3. ✅ Vous devez voir :
   - Volume estimé
   - Poids estimé
   - **⏱️ Temps estimé** (nouveau !)

### Test 2 : Modifier les Paramètres
1. Après l'import, un panneau "⚙️ Paramètres d'impression" s'affiche
2. Modifiez la **hauteur de couche** : 0.2 → 0.3
3. ✅ Le temps doit **diminuer** automatiquement
4. Modifiez la **vitesse** : 50 → 70
5. ✅ Le temps doit **encore diminuer**

### Test 3 : Supports
1. Activez les **supports** : Non → Oui
2. ✅ Le temps doit **augmenter** de ~15-20%

### Test 4 : Champs Automatiques
1. ✅ Les champs **"Heures"** et **"Minutes"** sont remplis automatiquement
2. ✅ Le **coût total** est recalculé automatiquement

---

## 📊 Paramètres Disponibles

| Paramètre | Défaut | Description |
|-----------|--------|-------------|
| **Hauteur couche** | 0.2 mm | Plus bas = meilleure qualité, plus long |
| **Vitesse** | 50 mm/s | Plus élevé = plus rapide, moins de détails |
| **Remplissage** | 20% | Plus élevé = plus solide, plus long |
| **Supports** | Non | Oui si géométrie complexe |

---

## 📖 Documentation

- **[ESTIMATION-TEMPS.md](ESTIMATION-TEMPS.md)** - Guide complet de la nouvelle fonctionnalité
- **[README.md](README.md)** - Documentation principale mise à jour

---

## ✅ Checklist

- [ ] Code poussé sur GitHub
- [ ] Stack redéployée dans Portainer
- [ ] Cache du navigateur vidé
- [ ] Import STL affiche le temps estimé
- [ ] Paramètres d'impression modifiables
- [ ] Temps se recalcule automatiquement
- [ ] Champs heures/minutes remplis automatiquement

---

## 🎯 Résultat Attendu

Après le déploiement :
- ✅ Import STL affiche le **temps estimé**
- ✅ Panneau **"⚙️ Paramètres d'impression"** visible
- ✅ Modification des paramètres → temps mis à jour
- ✅ Champs **heures/minutes** remplis automatiquement
- ✅ **Coût total** recalculé avec le nouveau temps

---

## 🐛 En Cas de Problème

### Le Temps N'est Pas Affiché
1. Vérifiez que le fichier STL est bien importé
2. Videz le cache : `Ctrl + Shift + R`
3. Vérifiez la console (F12) pour les erreurs
4. Vérifiez que la version Docker est bien **3.1.0** :
   ```bash
   docker ps --filter "name=calculateur" --format "{{.Label \"com.example.version\"}}"
   ```

### Les Paramètres Ne Sont Pas Visibles
1. Le panneau s'affiche **après** l'import STL
2. Importez d'abord un fichier `.stl`
3. Le panneau apparaît sous les informations du fichier

### Le Temps Ne Se Recalcule Pas
1. Vérifiez la console (F12) pour les erreurs
2. Rafraîchissez la page (F5)
3. Ré-importez le fichier STL

---

**Version** : 3.1.0  
**Date** : 14 janvier 2026  
**Status** : ✅ Prêt à déployer

**Prochaine étape** : [ESTIMATION-TEMPS.md](ESTIMATION-TEMPS.md) pour comprendre comment ça fonctionne !
