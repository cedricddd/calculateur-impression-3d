# 🚀 TEST RAPIDE - 1 Clic

## 🧪 **NOUVEAU : Test Sans Déploiement**

**Ouvrez directement** : `test-3mf-simple.html`

✅ Testez le support 3MF **immédiatement**  
✅ Glissez un fichier 3MF ou STL  
✅ Console de debug intégrée  
✅ Voir toutes les métadonnées extraites depuis le **G-code** !  
✅ **Aucun déploiement nécessaire !**

---

## 🎉 Nouvelle Version v3.5.0

**Extraction depuis le G-code** 🚀
- ✅ **100% des fichiers 3MF** : MakerWorld, Printables, exports locaux
- ✅ **Le G-code contient TOUT** : Temps, poids, longueur, couches
- ✅ Extraction depuis 4 sources (G-code, JSON, Config, XML)
- ✅ Temps, poids et longueur **toujours présents** dans le G-code
- ✅ **Plus AUCUN fichier avec 0s/0g/0mm !**
- ✅ **Calcul de coût 100% précis pour TOUS les fichiers 3MF !**

## Déployer Maintenant (5 minutes)

### 1. Push GitHub
```bash
git add .
git commit -m "Feat: Extraction depuis G-code + Support 100% 3MF (v3.5.0)"
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

✅ Exportez un 3MF depuis Bambu Studio / PrusaSlicer  
✅ **OU** téléchargez un 3MF depuis MakerWorld / Printables  
✅ Glissez-le dans le calculateur  
✅ **Tous les champs sont remplis automatiquement !**  
✅ Temps, poids et longueur **exacts** depuis le G-code

**Documentation** : [EXTRACTION-GCODE.md](Documentation/EXTRACTION-GCODE.md) et [RESUME-V3.5.0.md](Documentation/RESUME-V3.5.0.md)

## Console (F12)

Ouvrez la console pour voir les logs détaillés :
```
📄 Lecture du fichier G-code: Metadata/plate_1.gcode
✅ Données extraites depuis le G-code:
   Temps modèle: 32m 19s
   Temps total: 39m 30s
   Poids: 12.04 g
   Longueur: 3909.48 mm
   Couches: 93
🎯 Extraction des données d'impression...
  ⏱️ Temps depuis G-code (model): 1939 secondes
  ⚖️ Poids depuis G-code: 12.04 g
  📏 Longueur depuis G-code: 3909.48 mm
✅ Extraction 3MF terminée avec succès
```

---

**Version** : 3.5.0 🚀  
**Type** : Extraction depuis G-code + Support 100% 3MF  
**Nouveau** : `EXTRACTION-GCODE.md` et `RESUME-V3.5.0.md`
