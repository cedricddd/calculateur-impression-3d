# 🚀 Déploiement Final v3.5.0

## 🎯 Problème Résolu

**Symptôme** : `handle3MFFile: function` mais message "Veuillez sélectionner un fichier STL"

**Cause** : Le Dockerfile ne copiait pas tous les fichiers (manquait `favicon.svg`, `*.html`, `Documentation/`)

**Solution** : Dockerfile mis à jour pour copier tous les fichiers nécessaires

---

## ✅ Dockerfile Corrigé

### Changements

```dockerfile
# AVANT (v2.1.0)
COPY index.html /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/
COPY images/ /usr/share/nginx/html/images/
COPY README.md /usr/share/nginx/html/

# APRÈS (v3.5.0)
COPY index.html /usr/share/nginx/html/
COPY favicon.svg /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/
COPY images/ /usr/share/nginx/html/images/
COPY Documentation/ /usr/share/nginx/html/Documentation/
COPY README.md /usr/share/nginx/html/
COPY *.html /usr/share/nginx/html/
```

### Fichiers Ajoutés

- ✅ `favicon.svg` → Plus d'erreur 404
- ✅ `*.html` → Tous les fichiers HTML (test-3mf-simple.html, test-auto.html, etc.)
- ✅ `Documentation/` → Toute la documentation

---

## 🚀 Redéploiement Complet

### Méthode 1 : Via SSH (Recommandé)

```bash
# 1. Connexion au serveur
ssh user@192.168.1.124

# 2. Naviguer vers le projet
cd /chemin/vers/calculateur-impression-3d

# 3. Pull les dernières modifications
git pull origin main

# 4. Arrêter les conteneurs
docker-compose down

# 5. Rebuild SANS CACHE (IMPORTANT !)
docker-compose build --no-cache

# 6. Démarrer
docker-compose up -d

# 7. Vérifier les logs
docker-compose logs -f
```

**Appuyez sur `Ctrl+C` pour sortir des logs**

### Méthode 2 : Via Portainer

#### Étape 1 : Supprimer le Stack

1. **Portainer** → **Stacks**
2. **Sélectionner** votre stack
3. **Delete** → Confirmer

#### Étape 2 : Recréer le Stack

1. **Stacks** → **Add stack**
2. **Git Repository** :
   - URL : `https://github.com/cdn-team5/3dprinting-calc-repo-3d`
   - Reference : `refs/heads/main`
   - Compose path : `docker-compose.yml`
3. **Deploy the stack**
4. **Attendre** 1-2 minutes

---

## 🧪 Vérification Après Déploiement

### 1. Vérifier les Fichiers dans le Conteneur

**Via SSH** :

```bash
# Lister tous les fichiers
docker exec calculateur-impression-3d ls -la /usr/share/nginx/html/

# Vérifier que index.html contient handle3MFFile
docker exec calculateur-impression-3d grep -c "handle3MFFile" /usr/share/nginx/html/index.html

# Vérifier la taille (doit être > 60000 octets)
docker exec calculateur-impression-3d ls -lh /usr/share/nginx/html/index.html

# Vérifier que favicon.svg existe
docker exec calculateur-impression-3d ls -la /usr/share/nginx/html/favicon.svg

# Vérifier que Documentation/ existe
docker exec calculateur-impression-3d ls -la /usr/share/nginx/html/Documentation/
```

**Résultats attendus** :

```bash
# handle3MFFile dans index.html
5    ← Nombre d'occurrences (doit être > 0)

# Taille de index.html
61K   ← Environ 60 KB (doit être > 50 KB)

# favicon.svg
-rw-r--r-- 1 root root 252 Jan 14 18:57 favicon.svg

# Documentation/
drwxr-xr-x 2 root root 4096 Jan 14 18:57 Documentation
```

### 2. Test dans le Navigateur

1. **Vider le cache** : `Ctrl + Shift + R`
2. **Console** (`F12`) :

```javascript
console.log('JSZip:', typeof JSZip);
console.log('handle3MFFile:', typeof window.handle3MFFile);
console.log('handleSTLUpload:', typeof window.handleSTLUpload);
```

**Résultat attendu** :
```
JSZip: function
handle3MFFile: function
handleSTLUpload: function
```

### 3. Test Import 3MF

1. **Section** : "Import STL / 3MF"
2. **Cliquer** : "Choisir un fichier"
3. **Sélectionner** : Fichier `.3mf`
4. **Console** : Vérifier les logs avec emojis

**Résultat attendu** :
```
📁 Fichier sélectionné: votre-fichier.3mf
📦 Fichier 3MF détecté
📄 Lecture du fichier G-code: Metadata/plate_1.gcode
✅ Données extraites depuis le G-code
```

---

## 🎯 Si le Problème Persiste

### Diagnostic Approfondi

**Console du navigateur** :

```javascript
// Test complet de diagnostic
(async function() {
  // 1. Vérifier les fonctions
  console.log('=== FONCTIONS ===');
  console.log('JSZip:', typeof JSZip);
  console.log('handle3MFFile:', typeof window.handle3MFFile);
  console.log('handleSTLUpload:', typeof window.handleSTLUpload);
  
  // 2. Vérifier le code source
  const response = await fetch('index.html?t=' + Date.now());
  const html = await response.text();
  
  console.log('\n=== CODE SOURCE ===');
  console.log('Taille fichier:', html.length, 'caractères');
  console.log('Contient handle3MFFile:', html.includes('handle3MFFile') ? '✅' : '❌');
  console.log('Contient "Lecture du fichier G-code":', html.includes('Lecture du fichier G-code') ? '✅' : '❌');
  console.log('Contient "endsWith(\'.3mf\')":', html.includes('endsWith(\'.3mf\')') ? '✅' : '❌');
  
  // 3. Vérifier l'input file
  const input = document.getElementById('stlFileInput');
  console.log('\n=== INPUT FILE ===');
  console.log('Input existe:', !!input);
  console.log('Accept:', input?.accept);
  console.log('OnChange défini:', !!input?.onchange);
})();
```

**Partagez-moi TOUS les résultats !**

---

## 📋 Checklist Complète

- [ ] Git pull sur le serveur
- [ ] Dockerfile mis à jour (version 3.5.0)
- [ ] `docker-compose down`
- [ ] `docker-compose build --no-cache`
- [ ] `docker-compose up -d`
- [ ] Vérifier fichiers dans conteneur
- [ ] Vider cache navigateur (`Ctrl+Shift+R`)
- [ ] Test `typeof window.handle3MFFile` → `"function"`
- [ ] Test import 3MF → Voir logs avec emojis

---

## 🚨 Commandes de Debug SSH

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Inspecter le conteneur
docker inspect calculateur-impression-3d

# Entrer dans le conteneur
docker exec -it calculateur-impression-3d sh

# Dans le conteneur, vérifier les fichiers
ls -la /usr/share/nginx/html/
cat /usr/share/nginx/html/index.html | grep handle3MFFile
```

---

**Version** : 3.5.0  
**Dockerfile** : Mis à jour  
**Action** : Rebuild complet nécessaire  
**Temps estimé** : 3-5 minutes
