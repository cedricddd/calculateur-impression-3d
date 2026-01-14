# ✅ CHECKLIST DE DÉPLOIEMENT - Version 3.0.1

## 📋 À Faire Maintenant

### 1️⃣ Pousser sur GitHub (2 minutes)

```bash
cd /chemin/vers/calculateur-impression-3d

# Ajouter tous les nouveaux fichiers
git add .

# Commit avec message clair
git commit -m "Fix: Mode sombre et import STL pour Docker/Portainer (v3.0.1)

- Ajout d'un script inline dans index.html pour définir les fonctions critiques
- toggleTheme() et handleSTLUpload() maintenant disponibles immédiatement
- Suppression de la dépendance Three.js pour l'analyse STL
- Ajout de test-auto.html pour vérifier automatiquement le fonctionnement
- Ajout de RECAPITULATIF.md, CORRECTIF-DOCKER.md, DEPLOIEMENT-RAPIDE.md
- Mise à jour du README.md avec la v3.0.1
- Version Docker Compose : 3.0.0 → 3.0.1"

# Pousser vers GitHub
git push origin main
```

✅ **Fichiers qui seront poussés :**
- ✅ `index.html` (modifié - script inline ajouté)
- ✅ `docker-compose.yml` (modifié - version 3.0.1)
- ✅ `README.md` (modifié - documentation v3.0.1)
- ✨ `test-auto.html` (nouveau)
- ✨ `RECAPITULATIF.md` (nouveau)
- ✨ `CORRECTIF-DOCKER.md` (nouveau)
- ✨ `DEPLOIEMENT-RAPIDE.md` (nouveau)
- ✨ `STRUCTURE-PROJET.md` (nouveau)
- ✨ `test-docker.sh` (nouveau)
- ✨ `CHECKLIST-DEPLOIEMENT.md` (nouveau - ce fichier)

---

### 2️⃣ Redéployer dans Portainer (1 minute)

1. Ouvrez **Portainer** : `http://IP_SERVEUR:9000` (ou votre port)
2. **Stacks** → `calculateur-impression-3d`
3. Cliquez sur **🔄 Pull and redeploy**
4. Attendez 30-60 secondes

**OU** si ça ne fonctionne pas :

1. **Stacks** → `calculateur-impression-3d` → **Delete**
2. **Stacks** → **Add stack**
3. Nom : `calculateur-impression-3d`
4. **Repository** → URL de votre repo GitHub
5. **Deploy the stack**

---

### 3️⃣ Vider le Cache du Navigateur (30 secondes) ⚠️

**C'EST L'ÉTAPE LA PLUS IMPORTANTE !**

#### Option A - Hard Refresh (Recommandé)
- **Windows/Linux** : `Ctrl + Shift + R` ou `Ctrl + F5`
- **Mac** : `Cmd + Shift + R`

#### Option B - Vider le Cache Complet
- **Windows/Linux** : `Ctrl + Shift + Del`
- **Mac** : `Cmd + Shift + Del`
- Cochez "Images et fichiers en cache"
- Période : "Toutes les données"
- Cliquez sur "Effacer les données"

#### Option C - Navigation Privée (Pour Tester)
- **Windows/Linux** : `Ctrl + Shift + N`
- **Mac** : `Cmd + Shift + N`
- Accédez à : `http://IP_SERVEUR:3080`

---

### 4️⃣ Tester le Fonctionnement (2 minutes)

#### Test 1 : Page Principale
**URL** : `http://IP_SERVEUR:3080`

✅ Vérifications :
- [ ] La page s'affiche correctement
- [ ] Les icônes Font Awesome sont visibles
- [ ] Le design est correct (dégradé violet/indigo)

#### Test 2 : Mode Sombre
**Action** : Cliquez sur le bouton "Mode Sombre" en haut à droite

✅ Résultat attendu :
- [ ] La page devient sombre **immédiatement**
- [ ] L'icône change de 🌙 à ☀️
- [ ] Le texte change de "Mode Sombre" à "Mode Clair"
- [ ] Rechargez la page → le mode sombre est conservé

#### Test 3 : Import STL
**Action** : Glissez un fichier `.stl` dans la zone "Import STL"

✅ Résultat attendu :
- [ ] Le fichier est accepté
- [ ] Les informations s'affichent (nom, volume, poids)
- [ ] Le champ "Poids utilisé" est rempli automatiquement
- [ ] Les coûts se recalculent automatiquement

#### Test 4 : Console JavaScript
**Action** : Appuyez sur `F12` → Onglet "Console"

✅ Résultat attendu :
- [ ] Aucune erreur rouge
- [ ] Pas de "ReferenceError: toggleTheme is not defined"
- [ ] Pas de "ReferenceError: handleSTLUpload is not defined"

#### Test 5 : Tests Automatiques
**URL** : `http://IP_SERVEUR:3080/test-auto.html`

**Action** : Cliquez sur "Lancer tous les tests"

✅ Résultat attendu :
- [ ] Tous les tests sont verts (✓ Réussi)
- [ ] 8/8 tests passés
- [ ] Aucun test échoué

---

## 🐛 Si Un Test Échoue

### Mode Sombre ne Fonctionne Pas
1. Videz le cache (Hard Refresh : `Ctrl + Shift + R`)
2. Vérifiez la console (F12) → Recherchez les erreurs
3. Testez avec `test-auto.html`
4. Si erreur "toggleTheme is not defined" :
   - La version 3.0.1 n'est pas déployée
   - Redéployez la stack depuis Portainer

### Import STL ne Fonctionne Pas
1. Vérifiez que le fichier est bien un `.stl`
2. Testez avec un petit fichier (< 1 MB)
3. Ouvrez la console (F12) et cherchez les erreurs
4. Si erreur "handleSTLUpload is not defined" :
   - La version 3.0.1 n'est pas déployée
   - Redéployez la stack depuis Portainer

### Page ne S'affiche Pas
1. Vérifiez que le conteneur est démarré :
   ```bash
   docker ps | grep calculateur
   ```
2. Consultez les logs :
   ```bash
   docker logs calculateur-impression-3d
   ```
3. Vérifiez le port :
   ```bash
   docker port calculateur-impression-3d
   ```
4. Testez la connexion :
   ```bash
   curl http://localhost:3080
   ```

### Tests Automatiques Échouent
1. Identifiez quel test échoue
2. Consultez [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Consultez [CORRECTIF-DOCKER.md](CORRECTIF-DOCKER.md)
4. Partagez les résultats des tests

---

## 📊 Vérifications Finales

### Vérifier la Version du Conteneur
```bash
docker ps --filter "name=calculateur-impression-3d" --format "{{.Label \"com.example.version\"}}"
```
✅ Devrait afficher : **3.0.1**

### Vérifier que le Conteneur est en Bonne Santé
```bash
docker inspect --format='{{.State.Health.Status}}' calculateur-impression-3d
```
✅ Devrait afficher : **healthy**

### Vérifier les Ports
```bash
docker port calculateur-impression-3d
```
✅ Devrait afficher : **80/tcp -> 0.0.0.0:3080**

### Lancer le Test Docker Complet
```bash
chmod +x test-docker.sh
./test-docker.sh
```
✅ Devrait afficher : **✓ Tous les tests sont passés avec succès !**

---

## 📝 Checklist Complète

### Avant le Déploiement
- [ ] Code modifié et testé localement
- [ ] `index.html` contient le script inline
- [ ] `docker-compose.yml` indique version 3.0.1
- [ ] `README.md` mis à jour
- [ ] Tous les nouveaux fichiers créés

### Pendant le Déploiement
- [ ] Code poussé sur GitHub
- [ ] Stack redéployée dans Portainer
- [ ] Conteneur démarré avec succès
- [ ] Health check : healthy

### Après le Déploiement
- [ ] Cache du navigateur vidé
- [ ] Page principale s'affiche
- [ ] Mode sombre fonctionne
- [ ] Import STL fonctionne
- [ ] Console sans erreur
- [ ] Tests automatiques passent (8/8)

---

## 🎉 Succès !

Si tous les tests passent, félicitations ! 🎊

Votre calculateur 3D est maintenant :
- ✅ Déployé sur Docker/Portainer
- ✅ Mode sombre fonctionnel
- ✅ Import STL opérationnel
- ✅ Sans erreurs JavaScript
- ✅ Production ready

### URLs à Retenir
- 🌐 **Calculateur** : `http://IP_SERVEUR:3080`
- 🧪 **Tests auto** : `http://IP_SERVEUR:3080/test-auto.html`
- 🔍 **Diagnostic** : `http://IP_SERVEUR:3080/test-diagnostic.html`

### Documentation Utile
- 📖 [README.md](README.md) - Documentation principale
- 📝 [RECAPITULATIF.md](RECAPITULATIF.md) - Résumé des corrections
- 🚀 [DEPLOIEMENT-RAPIDE.md](DEPLOIEMENT-RAPIDE.md) - Guide express
- 🔧 [CORRECTIF-DOCKER.md](CORRECTIF-DOCKER.md) - Corrections Docker
- 🐛 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Dépannage
- 📁 [STRUCTURE-PROJET.md](STRUCTURE-PROJET.md) - Structure du projet

---

## 🆘 Besoin d'Aide ?

### Informations à Fournir
```bash
# Version du conteneur
docker ps --filter "name=calculateur" --format "{{.Label \"com.example.version\"}}"

# Logs du conteneur
docker logs calculateur-impression-3d --tail 50

# État du conteneur
docker inspect calculateur-impression-3d | grep -A10 Health

# Tests automatiques
curl http://localhost:3080/test-auto.html
```

### Captures d'Écran Utiles
1. Console du navigateur (F12 → Console)
2. Résultats de `test-auto.html`
3. Erreurs dans Portainer (si applicable)

---

**Version** : 3.0.1  
**Date** : 14 janvier 2026  
**Statut** : ✅ Prêt pour le déploiement  
**Auteur** : Assistant AI  
**Support** : Voir documentation dans le repo
