# 🔧 Résolution : Port 8080 déjà utilisé

## 🎯 Solution Rapide (Recommandée)

### Option 1 : Changer le port dans docker-compose.yml

**Dans Portainer :**

1. **Stacks** → Sélectionner votre stack `calculateur-3d`
2. **Cliquer sur "Editor"**
3. **Modifier la ligne des ports** :

```yaml
# AVANT (port 8080 occupé)
ports:
  - "8080:80"

# APRÈS (choisir un port libre)
ports:
  - "3080:80"  # OU 9080, 8888, 3000, etc.
```

4. **Cliquer sur "Update the stack"**
5. **Accès** : `http://IP-SERVEUR:3080`

---

## 🔍 Vérifier quel port est libre

### Dans Portainer (si vous avez accès à la console)

1. **Containers** → N'importe quel conteneur → **Console**
2. Exécuter :

```bash
# Voir tous les ports utilisés
netstat -tlnp | grep LISTEN

# Ou avec ss
ss -tlnp | grep LISTEN
```

### Ports recommandés à essayer

```yaml
# Essayez dans cet ordre :
- "3080:80"   # Port 3080
- "9080:80"   # Port 9080
- "8888:80"   # Port 8888
- "3000:80"   # Port 3000
- "5000:80"   # Port 5000
- "7080:80"   # Port 7080
```

---

## 🚀 Solution Complète : Trouver et utiliser un port libre

### Étape 1 : Identifier qui utilise le port 8080

**Via SSH sur votre serveur Proxmox/conteneur :**

```bash
# Voir qui utilise le port 8080
sudo lsof -i :8080

# Ou avec netstat
sudo netstat -tlnp | grep 8080

# Ou avec ss
sudo ss -tlnp | grep 8080
```

**Résultat attendu :**
```
COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
nginx     1234 root   6u  IPv4  12345      0t0  TCP *:8080 (LISTEN)
```

### Étape 2 : Décider quoi faire

**Option A** : Arrêter le service qui utilise le port 8080
**Option B** : Utiliser un autre port (recommandé)

---

## 📝 Fichiers docker-compose.yml corrigés

### Version avec port 3080 (Recommandé)

```yaml
version: '3.8'

services:
  calculateur-3d:
    container_name: calculateur-impression-3d
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3080:80"  # ✅ PORT MODIFIÉ
    restart: unless-stopped
    environment:
      - TZ=Europe/Paris
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.1'
          memory: 64M
    networks:
      - calculateur-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    labels:
      - "traefik.enable=false"
      - "com.example.description=Calculateur de prix d'impression 3D"
      - "com.example.department=Production"
      - "com.example.version=2.1.0"

networks:
  calculateur-network:
    driver: bridge
```

### Version avec port automatique (Avancé)

```yaml
# Docker choisira un port libre automatiquement
ports:
  - "80"  # Pas de port hôte spécifié

# Après déploiement, voir le port assigné dans Portainer :
# Containers → calculateur-impression-3d → Port Configuration
```

---

## 🎯 Procédure complète de correction

### Dans Portainer (Méthode GUI)

1. **Supprimer la stack actuelle** (si elle existe) :
   - Stacks → calculateur-3d → **Remove**

2. **Recréer la stack avec le bon port** :
   - Stacks → **+ Add stack**
   - Name : `calculateur-3d`
   - Build method : Repository
   - Repository URL : `https://github.com/VOTRE-USERNAME/calculateur-impression-3d`

3. **Avant de déployer, éditer le docker-compose.yml** :
   - Cocher "Show advanced options"
   - Dans "Web editor", coller le contenu corrigé avec le port 3080

4. **Deploy the stack**

5. **Accéder** : `http://IP-SERVEUR:3080`

---

## 🔧 Alternative : Modifier directement sur GitHub

### Méthode 1 : Via l'interface GitHub

1. **Aller sur votre repo GitHub**
2. **Ouvrir** le fichier `docker-compose.yml`
3. **Cliquer** sur l'icône crayon (Edit)
4. **Modifier** la ligne :
   ```yaml
   ports:
     - "3080:80"  # Changer 8080 en 3080
   ```
5. **Commit changes**

6. **Dans Portainer** :
   - Stacks → calculateur-3d → **Pull and redeploy**

---

## 📊 Ports couramment utilisés à éviter

Ces ports sont souvent occupés :

```
❌ 80    - HTTP (souvent Nginx/Apache)
❌ 443   - HTTPS (souvent Nginx/Apache)
❌ 8080  - HTTP alternatif (Portainer, Jenkins, etc.)
❌ 8443  - HTTPS alternatif
❌ 9000  - Portainer
❌ 3306  - MySQL
❌ 5432  - PostgreSQL
❌ 6379  - Redis
❌ 27017 - MongoDB
```

### Ports généralement libres :

```
✅ 3080  - Recommandé
✅ 9080  - Recommandé
✅ 8888  - Souvent libre
✅ 3000  - Souvent libre
✅ 5000  - Souvent libre
✅ 7000  - Souvent libre
✅ 8181  - Souvent libre
```

---

## 🐛 Si le problème persiste

### Vérifier tous les conteneurs actifs

**Dans Portainer :**
- **Containers** → Voir tous les conteneurs qui tournent
- Vérifier les "Port Configuration"

### Nettoyer Docker

```bash
# Via SSH sur le serveur

# Arrêter tous les conteneurs
docker stop $(docker ps -aq)

# Supprimer les conteneurs arrêtés
docker container prune -f

# Supprimer les réseaux inutilisés
docker network prune -f

# Libérer de l'espace
docker system prune -f
```

---

## ✅ Solution finale recommandée

**Modifier votre `docker-compose.yml` sur GitHub :**

```yaml
version: '3.8'

services:
  calculateur-3d:
    container_name: calculateur-impression-3d
    build:
      context: .
      dockerfile: Dockerfile
    
    # ✅ UTILISER LE PORT 3080 AU LIEU DE 8080
    ports:
      - "3080:80"
    
    restart: unless-stopped
    environment:
      - TZ=Europe/Paris
    
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

**Puis dans Portainer :**
- Pull and redeploy

**Accès :** `http://IP-SERVEUR:3080`

---

## 💡 Astuce pour plusieurs applications

Si vous voulez héberger plusieurs applications :

```yaml
# App 1 - Calculateur 3D
ports:
  - "3080:80"

# App 2 - Autre application
ports:
  - "3081:80"

# App 3 - Encore une autre
ports:
  - "3082:80"
```

---

## 📞 Besoin d'aide supplémentaire ?

Si ça ne fonctionne toujours pas, donnez-moi :
1. Le résultat de : `docker ps` ou `sudo netstat -tlnp | grep LISTEN`
2. Le port que vous voulez utiliser
3. Je vous fournirai le docker-compose.yml exact à utiliser

---

**🎯 Solution rapide : Utilisez le port 3080 à la place !**

**Accès après correction :** `http://IP-SERVEUR:3080`