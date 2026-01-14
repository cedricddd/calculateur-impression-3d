# 🚀 Quick Start - Déploiement Portainer + GitHub

## ⚡ Déploiement en 5 minutes

### 📝 Ce dont vous avez besoin
- ✅ Compte GitHub
- ✅ Portainer installé sur Proxmox
- ✅ Ces fichiers du projet

---

## 🎯 Étapes rapides

### 1️⃣ Créer le repository GitHub (2 min)

1. Aller sur https://github.com
2. Cliquer sur `+` → `New repository`
3. Nom : `calculateur-impression-3d`
4. Visibilité : **Public** (plus simple)
5. **Create repository**

### 2️⃣ Uploader les fichiers (1 min)

**Sur GitHub, dans votre nouveau repo :**

1. Cliquer sur `Add file` → `Upload files`
2. Glisser-déposer **tous ces fichiers** :
   - ✅ `index.html`
   - ✅ `js/calculator.js` (créer le dossier js d'abord)
   - ✅ `Dockerfile`
   - ✅ `docker-compose.yml`
   - ✅ `nginx.conf`
   - ✅ `README.md`
   - ✅ `.gitignore`
   - ✅ `.dockerignore`

3. Cliquer sur `Commit changes`

**✅ URL de votre repo :** `https://github.com/VOTRE-USERNAME/calculateur-impression-3d`

### 3️⃣ Déployer dans Portainer (2 min)

1. **Ouvrir Portainer** : `http://IP-PROXMOX:9000`

2. **Menu gauche** → `Stacks`

3. **Cliquer** sur `+ Add stack`

4. **Remplir** :
   ```
   Name: calculateur-3d
   
   Build method: ☑️ Repository
   
   Repository URL: https://github.com/VOTRE-USERNAME/calculateur-impression-3d
   
   Reference: refs/heads/main
   
   Compose path: docker-compose.yml
   
   Authentication: Désactivé (si repo public)
   ```

5. **Cliquer** sur `Deploy the stack`

6. **Attendre** quelques secondes... ✨

### 4️⃣ Accéder à l'application (immédiat)

**🎉 Votre application est en ligne !**

```
http://IP-DE-VOTRE-SERVEUR:8080
```

**Exemple :**
- Si votre Proxmox est sur `192.168.1.100`
- L'app sera sur : `http://192.168.1.100:8080`

---

## 🔄 Mise à jour de l'application

### Modifier un fichier

1. **Sur GitHub**, ouvrir le fichier à modifier
2. Cliquer sur l'icône **crayon** (Edit)
3. Modifier le contenu
4. Cliquer sur `Commit changes`

### Redéployer dans Portainer

1. **Portainer** → `Stacks`
2. Cliquer sur `calculateur-3d`
3. Cliquer sur `Pull and redeploy`
4. **C'est fait !** ✅

---

## 🎨 Personnalisation rapide

### Changer le port

**Dans le fichier `docker-compose.yml` sur GitHub :**

```yaml
ports:
  - "9090:80"  # Changer 8080 en 9090 (ou autre)
```

Ensuite : Pull and redeploy

### Ajouter un nom de domaine local

**Sur votre PC, éditer le fichier hosts :**

**Windows** : `C:\Windows\System32\drivers\etc\hosts`
```
192.168.1.100    calculateur.local
```

**Accès** : `http://calculateur.local:8080`

---

## 📊 Surveillance

### Dans Portainer

1. **Containers** → `calculateur-impression-3d`
2. Voir :
   - ✅ **Logs** : Logs en temps réel
   - ✅ **Stats** : CPU, RAM, Network
   - ✅ **Console** : Shell dans le conteneur
   - ✅ **Inspect** : Configuration complète

### Actions rapides

- ▶️ **Start** : Démarrer
- ⏸️ **Stop** : Arrêter
- 🔄 **Restart** : Redémarrer
- 🗑️ **Remove** : Supprimer

---

## 🆘 Problèmes courants

### ❌ Le conteneur ne démarre pas

**Vérifier :**
```bash
# Le port 8080 est-il libre ?
# Essayer un autre port : 9090, 3000, etc.
```

**Dans Portainer :**
- Containers → calculateur-impression-3d → **Logs**

### ❌ L'app n'est pas accessible

**Tester depuis le serveur :**
```bash
curl http://localhost:8080
```

**Vérifier le pare-feu :**
- Le port 8080 est-il ouvert ?

### ❌ Erreur lors du déploiement

**Vérifier que tous les fichiers sont sur GitHub :**
- [ ] Dockerfile
- [ ] docker-compose.yml
- [ ] nginx.conf
- [ ] index.html
- [ ] js/calculator.js

---

## 💡 Astuces

### 🔐 Repository privé

Si votre repo est **privé** :

1. Dans Portainer, activer **Authentication**
2. Entrer vos identifiants GitHub
3. Ou créer un **Personal Access Token** :
   - GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Scopes : `repo`
   - Utiliser le token comme mot de passe

### 🤖 Déploiement automatique

**Activer le webhook GitHub** :

1. **Portainer** → Stacks → calculateur-3d → **Webhooks**
2. Copier l'URL
3. **GitHub** → Settings → Webhooks → Add webhook
4. Coller l'URL
5. **À chaque push sur GitHub = redéploiement automatique !** 🎉

### 📦 Sauvegarder la configuration

**Dans Portainer** :
- Stacks → calculateur-3d → **Editor**
- Copier le contenu du docker-compose.yml
- Sauvegarder localement

---

## ✅ Checklist complète

- [ ] Compte GitHub créé
- [ ] Repository créé
- [ ] Fichiers uploadés sur GitHub
- [ ] Portainer accessible
- [ ] Stack déployée dans Portainer
- [ ] Application accessible sur http://IP:8080
- [ ] Tester le calculateur
- [ ] 🎉 Bravo !

---

## 📞 Besoin d'aide ?

**Fichiers de documentation :**
- 📄 `README.md` : Documentation de l'application
- 🚀 `DEPLOIEMENT-PORTAINER.md` : Guide détaillé complet
- 🖥️ `DEPLOIEMENT.md` : Guide déploiement sans Docker

---

**🎊 Votre calculateur est maintenant accessible sur votre réseau !**

**URL** : `http://VOTRE-IP:8080`