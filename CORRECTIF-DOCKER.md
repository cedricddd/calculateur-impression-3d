# 🔧 Correctif Docker/Portainer - Mode Sombre et Import STL

## ❌ Problèmes Résolus

1. **Mode Sombre** ne fonctionnait pas une fois déployé
2. **Import STL** ne fonctionnait pas une fois déployé
3. Erreurs JavaScript dans la console :
   - `toggleTheme is not defined`
   - `handleSTLUpload is not defined`

## ✅ Solutions Appliquées

### 1. Script Inline Ajouté
Les fonctions critiques (`toggleTheme`, `handleSTLUpload`, `clearSTL`) ont été déplacées dans un **script inline** dans le `<head>` de `index.html`.

**Avantages :**
- ✅ Les fonctions sont disponibles **immédiatement** au chargement de la page
- ✅ Plus de problème de timing avec le chargement de `calculator.js`
- ✅ Fonctionne même si le fichier externe a des problèmes de cache

### 2. Initialisation du Thème au Chargement
Le thème sauvegardé est appliqué **avant même** le rendu de la page :
```javascript
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
})();
```

### 3. Version Mise à Jour
- Docker Compose : **v3.0.1**
- Fichiers modifiés : `index.html`, `docker-compose.yml`

---

## 🚀 Comment Déployer la Correction

### Option 1 : Via GitHub + Portainer (Recommandé)

#### Étape 1 : Pousser sur GitHub
```bash
# Dans votre terminal/Git Bash
cd /chemin/vers/calculateur-impression-3d

git add index.html docker-compose.yml CORRECTIF-DOCKER.md
git commit -m "Fix: Mode sombre et import STL pour Docker/Portainer (v3.0.1)"
git push origin main
```

#### Étape 2 : Redéployer dans Portainer
1. Connectez-vous à **Portainer**
2. Allez dans **Stacks** → `calculateur-impression-3d`
3. Cliquez sur **Pull and redeploy** (icône de rafraîchissement)
4. Attendez la fin du déploiement (~30 secondes)

#### Étape 3 : Vider le Cache du Navigateur
⚠️ **CRITIQUE** : Le cache du navigateur peut bloquer les nouveaux changements !

**Méthode 1 - Hard Refresh :**
- Windows/Linux : `Ctrl + Shift + R` ou `Ctrl + F5`
- Mac : `Cmd + Shift + R`

**Méthode 2 - Vider tout le cache :**
- Windows/Linux : `Ctrl + Shift + Del`
- Mac : `Cmd + Shift + Del`
- Cochez "Images et fichiers en cache"
- Cliquez sur "Effacer les données"

**Méthode 3 - Navigation privée :**
- Windows/Linux : `Ctrl + Shift + N`
- Mac : `Cmd + Shift + N`
- Accédez à `http://IP-SERVEUR:3080`

---

### Option 2 : Via Portainer Web UI (Sans Git)

#### Étape 1 : Mettre à jour la Stack
1. Connectez-vous à **Portainer**
2. Allez dans **Stacks** → `calculateur-impression-3d`
3. Cliquez sur **Editor**
4. Cherchez la ligne avec `version=3.0.0`
5. Changez en `version=3.0.1`
6. Cliquez sur **Update the stack**

#### Étape 2 : Supprimer et Recréer (si nécessaire)
Si le pull ne fonctionne pas :
1. **Stacks** → `calculateur-impression-3d` → **Delete**
2. **Stacks** → **Add stack**
3. Nom : `calculateur-impression-3d`
4. **Repository** → URL de votre repo GitHub
5. **Deploy the stack**

#### Étape 3 : Vider le Cache (voir Option 1, Étape 3)

---

## ✅ Tests à Effectuer

### Test 1 : Mode Sombre
1. Accédez à `http://IP-SERVEUR:3080`
2. Cliquez sur le bouton **Mode Sombre** (en haut à droite)
3. ✅ La page doit passer en mode sombre **immédiatement**
4. ✅ L'icône doit changer de 🌙 à ☀️
5. ✅ Rechargez la page → le mode sombre doit être conservé

### Test 2 : Import STL
1. Préparez un fichier `.stl` (n'importe quel modèle 3D)
2. Glissez-déposez le fichier dans la zone "Import STL"
   - OU cliquez sur "Choisir un fichier"
3. ✅ Les informations doivent s'afficher :
   - Nom du fichier
   - Volume estimé (cm³)
   - Poids estimé (g)
4. ✅ Le champ "Poids utilisé" doit être rempli automatiquement
5. ✅ Les coûts doivent se recalculer automatiquement

### Test 3 : Console (F12)
1. Ouvrez la console du navigateur (`F12`)
2. Allez dans l'onglet **Console**
3. ✅ Aucune erreur rouge ne doit apparaître
4. ✅ Pas de "ReferenceError: toggleTheme is not defined"
5. ✅ Pas de "ReferenceError: handleSTLUpload is not defined"

---

## 🐛 Si Ça Ne Fonctionne Toujours Pas

### 1. Vérifier que le Conteneur est Bien Mis à Jour
```bash
# SSH sur votre serveur Proxmox
ssh root@IP_SERVEUR

# Vérifier la version du conteneur
docker ps --filter "name=calculateur-impression-3d" --format "{{.Names}}: {{.Label \"com.example.version\"}}"

# Devrait afficher : calculateur-impression-3d: 3.0.1
```

### 2. Forcer la Reconstruction de l'Image
```bash
# Dans Portainer
# Stacks → calculateur-impression-3d → Delete

# Puis recréer avec "Re-pull image and redeploy" cochée
```

### 3. Vérifier les Logs du Conteneur
```bash
# Dans Portainer
# Containers → calculateur-impression-3d → Logs

# OU via SSH
docker logs calculateur-impression-3d
```

### 4. Tester avec test-diagnostic.html
Accédez à : `http://IP-SERVEUR:3080/test-diagnostic.html`

**Tests disponibles :**
1. Test LocalStorage
2. Test Mode Sombre
3. Test Upload STL
4. Test Chargement des Scripts
5. Console du Navigateur

---

## 📋 Checklist Complète

- [ ] Code mis à jour sur GitHub
- [ ] Stack redéployée dans Portainer
- [ ] Cache du navigateur vidé (Hard Refresh)
- [ ] Mode Sombre fonctionne
- [ ] Import STL fonctionne
- [ ] Aucune erreur dans la console (F12)
- [ ] Test avec `test-diagnostic.html` passé

---

## 📝 Fichiers Modifiés

| Fichier | Modification |
|---------|-------------|
| `index.html` | ✅ Ajout d'un script inline avec `toggleTheme`, `handleSTLUpload`, `clearSTL` |
| `docker-compose.yml` | ✅ Version mise à jour : `3.0.0` → `3.0.1` |
| `CORRECTIF-DOCKER.md` | ✅ Nouveau fichier (ce document) |

---

## 🎯 Résultat Attendu

Après le déploiement et le vidage du cache :

✅ **Mode Sombre** : Fonctionne immédiatement au clic  
✅ **Import STL** : Analyse le fichier et remplit automatiquement le poids  
✅ **Aucune erreur** dans la console JavaScript  
✅ **Comportement identique** à la version locale  

---

## 💡 Pourquoi Ça Ne Fonctionnait Pas Avant ?

### Problème 1 : Timing de Chargement
- Le fichier `calculator.js` se charge **après** le HTML
- Les boutons avec `onclick="toggleTheme()"` appellent la fonction **avant** qu'elle ne soit définie
- En local, le fichier est en cache → chargement rapide
- En Docker, le fichier peut avoir des latences réseau

### Problème 2 : Cache du Navigateur
- Le navigateur garde en mémoire l'ancienne version de `calculator.js`
- Même après un redéploiement Docker, le navigateur ne re-télécharge pas le fichier

### Solution : Script Inline
- Les fonctions sont dans le `<head>` → **disponibles immédiatement**
- Pas de dépendance au chargement du fichier externe
- Fonctionne même avec un cache agressif

---

## 🔗 Liens Utiles

- [Guide de déploiement complet](DEPLOIEMENT-PORTAINER.md)
- [Guide de démarrage rapide](QUICK-START.md)
- [Guide de dépannage](TROUBLESHOOTING.md)
- [Page de diagnostic](http://IP-SERVEUR:3080/test-diagnostic.html)

---

## ❓ Besoin d'Aide ?

Si vous rencontrez toujours des problèmes :

1. Vérifiez que la version du conteneur est bien **3.0.1** :
   ```bash
   docker ps --filter "name=calculateur-impression-3d" --format "{{.Label \"com.example.version\"}}"
   ```

2. Testez avec la page de diagnostic :
   - `http://IP-SERVEUR:3080/test-diagnostic.html`

3. Partagez les informations suivantes :
   - Logs du conteneur : `docker logs calculateur-impression-3d`
   - Erreurs de la console (F12 → Console)
   - Résultats du test de diagnostic

---

**Version du correctif :** 3.0.1  
**Date :** 14 janvier 2026  
**Testé sur :** Docker 24.x, Portainer 2.x, Proxmox 8.x
