# 🚀 TEST RAPIDE - 1 Clic

## 🧪 **NOUVEAU : Test Sans Déploiement**

**Ouvrez directement** : `test-3mf-simple.html`

✅ Testez le support 3MF **immédiatement**  
✅ Glissez un fichier 3MF ou STL  
✅ Console de debug intégrée  
✅ Voir toutes les métadonnées extraites  
✅ **Aucun déploiement nécessaire !**

---

## 🎉 Nouvelle Version v3.4.0

**Extraction Complète depuis JSON et Config** 🎉
- ✅ Support complet des fichiers MakerWorld
- ✅ Extraction depuis 3 sources (JSON, Config, XML)
- ✅ Temps, poids et longueur exacts même sans tranchage local
- ✅ Logs détaillés pour voir d'où viennent les données
- ✅ **Calcul de coût 100% précis pour tous les fichiers 3MF !**

## Déployer Maintenant (5 minutes)

### 1. Push GitHub
```bash
git add .
git commit -m "Feat: Extraction complète JSON/Config + MakerWorld (v3.4.0)"
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

Ouvrez la console pour voir les logs détaillés :
```
🔍 Recherche des fichiers JSON/config...
📄 Lecture du fichier: Metadata/plate_1.json
✅ Données de plaque JSON chargées
📄 Lecture du fichier: Metadata/slice_info.config
✅ Configuration de tranchage chargée
🎯 Extraction des données d'impression...
  ⏱️ Temps depuis JSON (prediction): 19350 secondes
  ⚖️ Poids depuis JSON (filament_used_g): 142.5 g
  📏 Longueur depuis JSON: 47500 mm
✅ Extraction 3MF terminée avec succès
```

---

**Version** : 3.4.0 🎉  
**Type** : Extraction complète JSON/Config + Support MakerWorld  
**Nouveau** : `EXTRACTION-JSON-CONFIG.md` et `RESUME-V3.4.0.md`
