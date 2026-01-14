# 🚀 Déploiement avec Portainer et GitHub

Ce guide vous explique comment déployer facilement le **Calculateur d'Impression 3D** sur Portainer depuis votre compte GitHub.

---

## 📋 Prérequis

- ✅ **Portainer** installé sur votre serveur Proxmox
- ✅ **Compte GitHub** actif
- ✅ **Accès à Portainer** via navigateur

---

## 🎯 Méthode 1 : Déploiement depuis GitHub avec Portainer (RECOMMANDÉ)

### Étape 1 : Créer le repository GitHub

1. **Aller sur GitHub** : https://github.com
2. **Créer un nouveau repository** :
   - Cliquer sur le `+` en haut à droite → `New repository`
   - Nom : `calculateur-impression-3d` (ou votre choix)
   - Description : `Calculateur de prix d'impression 3D - Bambu Lab A1`
   - Visibilité : **Public** ou **Private** (au choix)
   - ✅ Cocher "Add a README file" (optionnel)
   - Cliquer sur **Create repository**

### Étape 2 : Pousser les fichiers sur GitHub

**Option A - Via GitHub Web (le plus simple)** :

1. Dans votre repository GitHub, cliquer sur **Add file** → **Upload files**
2. Glisser-déposer ces fichiers :
   ```
   index.html
   js/calculator.js
   Dockerfile
   docker-compose.yml
   nginx.conf
   README.md
   .gitignore
   .dockerignore
   ```
3. Cliquer sur **Commit changes**

**Option B - Via ligne de commande Git** :

```bash
# Dans le dossier de votre projet local
git init
git add .
git commit -m "Initial commit - Calculateur impression 3D v2.1.0"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/calculateur-impression-3d.git
git push -u origin main
```

### Étape 3 : Déployer avec Portainer

#### Méthode 3A : Via Stack (docker-compose)

1. **Ouvrir Portainer** : `http://IP_PROXMOX:9000`
2. **Sélectionner votre environnement** (local ou distant)
3. **Aller dans "Stacks"** (menu de gauche)
4. **Cliquer sur "+ Add stack"**
5. **Remplir les informations** :
   
   **Name** : `calculateur-3d`
   
   **Build method** : Choisir **"Repository"**
   
   **Repository URL** : `https://github.com/VOTRE-USERNAME/calculateur-impression-3d`
   
   **Repository reference** : `refs/heads/main`
   
   **Compose path** : `docker-compose.yml`
   
   **Authentication** : 
   - Si repository **public** : Laisser désactivé
   - Si repository **private** : Activer et entrer vos credentials GitHub
   
6. **Cliquer sur "Deploy the stack"**

#### Méthode 3B : Via Container (image Docker)

Si vous préférez un conteneur simple :

1. **Aller dans "Containers"** (menu de gauche)
2. **Cliquer sur "+ Add container"**
3. **Remplir** :
   - **Name** : `calculateur-impression-3d`
   - **Image** : `nginx:alpine` (temporaire, nous allons construire notre image)
   - **Port mapping** : 
     - Host: `8080` → Container: `80`
   - **Volumes** : Cliquer sur "+ map additional volume"
     - Container: `/usr/share/nginx/html`
     - Bind: Créer un volume ou utiliser un chemin local

4. **Cliquer sur "Deploy the container"**

### Étape 4 : Accéder à l'application

Une fois déployé, accéder à l'application :

```
http://IP_DE_VOTRE_SERVEUR:8080
```

Ou si vous avez utilisé un autre port :

```
http://IP_DE_VOTRE_SERVEUR:VOTRE_PORT
```

---

## 🎯 Méthode 2 : Build et Push vers Docker Hub (Avancé)

Si vous voulez créer votre propre image Docker :

### Étape 1 : Build l'image localement

```bash
# Dans le dossier du projet
docker build -t votre-username/calculateur-3d:latest .
```

### Étape 2 : Tester localement

```bash
docker run -d -p 8080:80 votre-username/calculateur-3d:latest
```

Tester : `http://localhost:8080`

### Étape 3 : Push vers Docker Hub

```bash
# Se connecter à Docker Hub
docker login

# Pousser l'image
docker push votre-username/calculateur-3d:latest
```

### Étape 4 : Déployer dans Portainer

1. **Aller dans "Containers"**
2. **Cliquer sur "+ Add container"**
3. **Image** : `votre-username/calculateur-3d:latest`
4. **Port mapping** : `8080:80`
5. **Deploy**

---

## 🎯 Méthode 3 : Déploiement rapide via Web Editor

Dans Portainer, vous pouvez aussi utiliser le **Web Editor** pour coller le docker-compose.yml :

1. **Stacks** → **+ Add stack**
2. **Name** : `calculateur-3d`
3. **Build method** : **Web editor**
4. **Coller le contenu** de `docker-compose.yml` mais **modifier** la section build :

```yaml
version: '3.8'

services:
  calculateur-3d:
    container_name: calculateur-impression-3d
    image: nginx:alpine
    ports:
      - "8080:80"
    restart: unless-stopped
    environment:
      - TZ=Europe/Paris
    volumes:
      # Monter les fichiers depuis GitHub (à adapter)
      - ./index.html:/usr/share/nginx/html/index.html:ro
      - ./js:/usr/share/nginx/html/js:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - calculateur-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  calculateur-network:
    driver: bridge
```

5. **Deploy the stack**

---

## 🔄 Mise à jour de l'application

### Avec la méthode Stack depuis GitHub

1. **Modifier vos fichiers** sur GitHub (push les changements)
2. Dans Portainer, aller dans **Stacks**
3. Sélectionner votre stack `calculateur-3d`
4. Cliquer sur **Pull and redeploy**
5. Confirmer

### Avec Docker Hub

1. **Rebuild et push** l'image :
   ```bash
   docker build -t votre-username/calculateur-3d:latest .
   docker push votre-username/calculateur-3d:latest
   ```

2. Dans Portainer :
   - **Containers** → Sélectionner votre container
   - **Recreate** → Activer "Pull latest image"
   - **Recreate**

---

## 🔧 Configuration avancée

### Variables d'environnement

Dans Portainer, vous pouvez ajouter des variables d'environnement :

```yaml
environment:
  - TZ=Europe/Paris
  - NGINX_HOST=calculateur-3d.local
  - NGINX_PORT=80
```

### Volumes persistants

Pour sauvegarder des données (logs, config) :

```yaml
volumes:
  - calculateur-data:/data
  - calculateur-logs:/var/log/nginx
```

### Traefik / Reverse Proxy

Si vous utilisez Traefik :

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.calculateur.rule=Host(`calculateur.votredomaine.com`)"
  - "traefik.http.services.calculateur.loadbalancer.server.port=80"
```

---

## 🌐 Accès avec nom de domaine

### Option 1 : Nom de domaine local (DNS local)

Dans votre routeur ou serveur DNS :
```
calculateur-3d.local → IP_DU_SERVEUR
```

### Option 2 : Fichier hosts (sur votre PC)

**Windows** : `C:\Windows\System32\drivers\etc\hosts`
**Linux/Mac** : `/etc/hosts`

Ajouter :
```
IP_DU_SERVEUR    calculateur-3d.local
```

### Option 3 : Reverse Proxy (Nginx Proxy Manager, Traefik)

Configurer un reverse proxy pour gérer le SSL et les noms de domaine.

---

## 📊 Surveillance dans Portainer

1. **Dashboard** → Voir les statistiques du conteneur
2. **Container details** → Logs, stats, console
3. **Quick actions** → Start, Stop, Restart, Kill
4. **Inspect** → Configuration détaillée

---

## 🐛 Dépannage

### Le conteneur ne démarre pas

1. **Vérifier les logs** dans Portainer :
   - Containers → Votre conteneur → Logs

2. **Vérifier le port** :
   - Le port 8080 est-il déjà utilisé ?
   - Changer le port : `8081:80` ou `9080:80`

3. **Vérifier les fichiers** :
   - Tous les fichiers sont-ils présents dans le repository ?

### L'application n'est pas accessible

1. **Vérifier que le conteneur tourne** :
   - Status : Running (vert)

2. **Tester localement** sur le serveur :
   ```bash
   curl http://localhost:8080
   ```

3. **Vérifier le pare-feu** :
   ```bash
   # Sur Proxmox/serveur
   iptables -L | grep 8080
   ```

### Les fichiers JavaScript ne chargent pas

1. **Vérifier la structure** dans le conteneur :
   ```bash
   docker exec calculateur-impression-3d ls -la /usr/share/nginx/html/
   ```

2. **Vérifier les permissions** :
   ```bash
   docker exec calculateur-impression-3d ls -la /usr/share/nginx/html/js/
   ```

---

## 📦 Structure du repository GitHub

Votre repository doit contenir :

```
calculateur-impression-3d/
├── index.html                # Page principale
├── js/
│   └── calculator.js         # Logique JavaScript
├── Dockerfile                # Configuration Docker
├── docker-compose.yml        # Orchestration des services
├── nginx.conf                # Configuration Nginx
├── README.md                 # Documentation
├── .gitignore                # Fichiers à ignorer par Git
└── .dockerignore             # Fichiers à ignorer par Docker
```

---

## 🎯 Avantages de cette méthode

✅ **Simple** : Déploiement en quelques clics depuis Portainer
✅ **Versionné** : Tout est dans Git, historique complet
✅ **Reproductible** : Facile à redéployer ou migrer
✅ **Automatisable** : Possibilité de CI/CD avec GitHub Actions
✅ **Isolé** : Conteneur Docker indépendant
✅ **Léger** : Image nginx:alpine (~25 MB)
✅ **Rapide** : Démarrage instantané
✅ **Portable** : Fonctionne partout où Docker est installé

---

## 🚀 Résumé des étapes rapides

```bash
# 1. Créer le repo sur GitHub
# 2. Pousser les fichiers
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE-USERNAME/calculateur-impression-3d.git
git push -u origin main

# 3. Dans Portainer :
#    Stacks → Add stack → Repository
#    URL: https://github.com/VOTRE-USERNAME/calculateur-impression-3d
#    Deploy

# 4. Accéder à http://IP_SERVEUR:8080
```

---

## 💡 Conseil Pro

Créez un **webhook GitHub** dans Portainer pour le déploiement automatique :

1. **Portainer** → **Stacks** → Votre stack → **Webhooks**
2. **Copier l'URL du webhook**
3. **GitHub** → Settings → Webhooks → Add webhook
4. Coller l'URL
5. Chaque push sur GitHub redéploiera automatiquement ! 🎉

---

**Application prête à déployer avec Portainer !** 🐳✨

URL d'accès après déploiement : `http://IP_SERVEUR:8080`