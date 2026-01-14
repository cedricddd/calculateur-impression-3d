# 🚀 ACTION IMMÉDIATE - 3 Commandes

## 🎉 Nouvelle Version v3.3.0

**Support COMPLET des fichiers 3MF** 🎉
- Extraction automatique du temps d'impression réel
- Extraction du poids de filament exact
- Extraction des paramètres d'impression (vitesse, hauteur, remplissage)
- Remplissage automatique de tous les champs
- **Calcul de coût 100% précis !**

## Déployer Maintenant (5 minutes)

### 1. Push GitHub
```bash
git add .
git commit -m "Feat: Support complet 3MF avec extraction métadonnées (v3.3.0)"
git push origin main
```

### 2. Redéployer Portainer
1. Portainer → Stacks → calculateur-impression-3d
2. Cliquez "Pull and redeploy"
3. Attendez 30 secondes

### 3. Vider le Cache ⚠️ IMPORTANT
- **Windows** : `Ctrl + Shift + R`
- **Mac** : `Cmd + Shift + R`

## Tester

**URL** : `http://192.168.1.124:3080`

✅ Exportez un 3MF depuis PrusaSlicer / Bambu Studio  
✅ Glissez-le dans le calculateur  
✅ **Tous les champs sont remplis automatiquement !**  
✅ Temps, poids et paramètres **exacts** depuis le slicer

**Documentation** : [SUPPORT-3MF-COMPLET.md](SUPPORT-3MF-COMPLET.md)

## Console (F12)

Ouvrez la console pour voir les logs :
```
📦 Fichier 3MF détecté - Extraction des métadonnées...
🔓 Décompression du fichier 3MF...
✅ Fichier ZIP chargé
📊 Métadonnées extraites
  ⏱️ Temps: 18450 secondes ( 308 minutes)
  ⚖️ Poids filament: 60.5 g
✅ Extraction 3MF terminée avec succès
```

---

**Version** : 3.3.0 🎉  
**Type** : Support 3MF complet avec JSZip
