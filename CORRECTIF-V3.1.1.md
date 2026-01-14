# 🐛 Correctif v3.1.1 - Durée Ne Change Pas

## Problème Identifié

Après l'import STL, le temps estimé s'affichait mais :
- ❌ Les champs **"Heures"** et **"Minutes"** ne se mettaient pas à jour
- ❌ Le champ **"Temps total"** restait à l'ancienne valeur

## Cause

La fonction `updateTimeEstimate()` modifiait les valeurs des champs `<input>` mais ne déclenchait pas l'événement `input`, donc :
- Les listeners JavaScript ne se déclenchaient pas
- La fonction `updateTotalTime()` n'était pas appelée
- L'affichage "Temps total" n'était pas mis à jour

## Solution Appliquée

### 1. Déclenchement des Événements Input
```javascript
if (printHoursEl) {
    printHoursEl.value = hours;
    // Déclencher l'événement input pour mettre à jour l'affichage
    printHoursEl.dispatchEvent(new Event('input', { bubbles: true }));
}
```

### 2. Ajout d'un Délai de Sécurité
```javascript
setTimeout(function() {
    if (typeof window.updateTimeEstimate === 'function') {
        window.updateTimeEstimate();
    }
}, 100);
```

---

## 🚀 Déployer le Correctif

### 1. Push GitHub
```bash
git add .
git commit -m "Fix: Mise à jour automatique des champs durée (v3.1.1)"
git push origin main
```

### 2. Redéployer Portainer
1. Portainer → Stacks → calculateur-impression-3d
2. **Pull and redeploy**
3. Attendez 30 secondes

### 3. Vider le Cache ⚠️ IMPORTANT
- **Windows** : `Ctrl + Shift + R`
- **Mac** : `Cmd + Shift + R`

---

## ✅ Test

### Test 1 : Import STL
1. Allez sur http://192.168.1.124:3080
2. Importez un fichier STL
3. ✅ Les champs **"Heures"** et **"Minutes"** doivent se remplir automatiquement
4. ✅ Le champ **"Temps total"** doit afficher le temps (ex: "5h 30min")

### Test 2 : Modification des Paramètres
1. Changez la **hauteur de couche** : 0.2 → 0.3
2. ✅ Les champs **"Heures"** et **"Minutes"** se mettent à jour
3. ✅ Le **"Temps total"** se met à jour
4. ✅ Le **coût total** se recalcule

---

## 🐛 En Cas de Problème

### Les Champs Ne Se Remplissent Toujours Pas
1. **Videz le cache** (c'est le plus important !)
   - `Ctrl + Shift + R` (Windows/Linux)
   - `Cmd + Shift + R` (Mac)
2. Vérifiez la version :
   ```bash
   docker ps --filter "name=calculateur" --format "{{.Label \"com.example.version\"}}"
   ```
   Devrait afficher : **3.1.1**
3. Vérifiez la console (F12) pour voir les erreurs

### Le Temps Total Ne S'affiche Pas
1. Rafraîchissez la page (F5)
2. Ré-importez le fichier STL
3. Vérifiez que les événements sont bien déclenchés :
   - Ouvrez la console (F12)
   - Tapez : `document.getElementById('printHours').value = 5`
   - Puis : `document.getElementById('printHours').dispatchEvent(new Event('input'))`
   - Le "Temps total" devrait se mettre à jour

---

## 📊 Différences v3.1.0 → v3.1.1

| Aspect | v3.1.0 | v3.1.1 |
|--------|--------|--------|
| **Temps affiché** | ✅ Oui | ✅ Oui |
| **Champs heures/minutes** | ❌ Non mis à jour | ✅ Mis à jour automatiquement |
| **Temps total** | ❌ Ancien temps | ✅ Nouveau temps |
| **Recalcul du coût** | ⚠️ Partiel | ✅ Complet |
| **Événements déclenchés** | ❌ Non | ✅ Oui |

---

## ✅ Résultat Attendu

Après le déploiement de la v3.1.1 :

1. ✅ Importez un STL → **tous les champs se remplissent**
2. ✅ Le **"Temps total"** affiche le bon temps
3. ✅ Le **coût total** est calculé avec le nouveau temps
4. ✅ Modifier les paramètres → **tout se met à jour en temps réel**

---

**Version** : 3.1.1  
**Date** : 14 janvier 2026  
**Status** : 🐛 Bug Fix  
**Priorité** : Haute (fonctionnalité cassée)
