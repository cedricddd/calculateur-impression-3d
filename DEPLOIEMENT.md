# Guide de Déploiement sur Proxmox

Ce guide vous explique comment déployer le **Calculateur d'Impression 3D** sur votre serveur Proxmox.

## 📋 Prérequis

- Serveur Proxmox accessible
- Accès SSH au serveur ou à un conteneur/VM
- Serveur web (Apache, Nginx, ou serveur web simple)

## 🚀 Option 1 : Déploiement avec Nginx (Recommandé)

### 1. Créer un conteneur LXC dans Proxmox

```bash
# Dans l'interface Proxmox, créer un conteneur LXC avec :
# - Template: Debian 11 ou Ubuntu 22.04
# - RAM: 512 MB (suffisant pour un serveur web statique)
# - Disk: 2 GB
# - Network: Bridge avec IP statique ou DHCP
```

### 2. Se connecter au conteneur

```bash
# Depuis l'interface Proxmox, ouvrir la console du conteneur
# Ou via SSH :
ssh root@IP_DU_CONTENEUR
```

### 3. Installer Nginx

```bash
# Mettre à jour les paquets
apt update && apt upgrade -y

# Installer Nginx
apt install nginx -y

# Vérifier que Nginx fonctionne
systemctl status nginx
systemctl enable nginx
```

### 4. Créer le répertoire du site

```bash
# Créer le répertoire pour l'application
mkdir -p /var/www/calculateur-3d

# Définir les permissions
chown -R www-data:www-data /var/www/calculateur-3d
chmod -R 755 /var/www/calculateur-3d
```

### 5. Transférer les fichiers

**Méthode A - Avec SCP depuis votre ordinateur :**

```bash
# Depuis votre machine locale (où se trouvent les fichiers)
scp -r index.html js/ root@IP_DU_CONTENEUR:/var/www/calculateur-3d/
```

**Méthode B - Avec Git (si vous avez un repository) :**

```bash
# Dans le conteneur
cd /var/www/calculateur-3d
git clone VOTRE_REPO_GIT .
```

**Méthode C - Créer les fichiers manuellement :**

```bash
# Dans le conteneur
cd /var/www/calculateur-3d

# Créer index.html
nano index.html
# Copier le contenu du fichier index.html et sauvegarder (Ctrl+X, Y, Enter)

# Créer le répertoire js
mkdir js

# Créer calculator.js
nano js/calculator.js
# Copier le contenu du fichier calculator.js et sauvegarder
```

### 6. Configurer Nginx

```bash
# Créer le fichier de configuration du site
nano /etc/nginx/sites-available/calculateur-3d
```

**Contenu du fichier de configuration :**

```nginx
server {
    listen 80;
    listen [::]:80;
    
    # Remplacer par votre nom de domaine ou IP
    server_name calculateur-3d.local IP_DU_CONTENEUR;
    
    root /var/www/calculateur-3d;
    index index.html;
    
    # Logs
    access_log /var/log/nginx/calculateur-3d-access.log;
    error_log /var/log/nginx/calculateur-3d-error.log;
    
    # Configuration pour les fichiers statiques
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Cache pour les fichiers statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
```

### 7. Activer le site

```bash
# Créer le lien symbolique pour activer le site
ln -s /etc/nginx/sites-available/calculateur-3d /etc/nginx/sites-enabled/

# Supprimer le site par défaut (optionnel)
rm /etc/nginx/sites-enabled/default

# Tester la configuration Nginx
nginx -t

# Recharger Nginx
systemctl reload nginx
```

### 8. Vérifier le déploiement

```bash
# Vérifier que Nginx écoute sur le port 80
netstat -tlnp | grep :80

# Ou avec ss
ss -tlnp | grep :80
```

**Tester dans le navigateur :**
```
http://IP_DU_CONTENEUR
```

---

## 🚀 Option 2 : Déploiement avec Apache

### 1-2. Créer le conteneur (même que Option 1)

### 3. Installer Apache

```bash
# Mettre à jour les paquets
apt update && apt upgrade -y

# Installer Apache
apt install apache2 -y

# Vérifier qu'Apache fonctionne
systemctl status apache2
systemctl enable apache2
```

### 4. Transférer les fichiers

```bash
# Créer le répertoire
mkdir -p /var/www/html/calculateur-3d

# Transférer les fichiers (même méthodes que Option 1)
# Les fichiers doivent être dans /var/www/html/calculateur-3d/
```

### 5. Configurer Apache

```bash
# Créer le fichier de configuration
nano /etc/apache2/sites-available/calculateur-3d.conf
```

**Contenu du fichier :**

```apache
<VirtualHost *:80>
    ServerName calculateur-3d.local
    ServerAlias IP_DU_CONTENEUR
    
    DocumentRoot /var/www/html/calculateur-3d
    
    <Directory /var/www/html/calculateur-3d>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/calculateur-3d-error.log
    CustomLog ${APACHE_LOG_DIR}/calculateur-3d-access.log combined
    
    # Cache pour les fichiers statiques
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        Header set Cache-Control "max-age=2592000, public"
    </FilesMatch>
</VirtualHost>
```

### 6. Activer le site

```bash
# Activer le module headers
a2enmod headers

# Activer le site
a2ensite calculateur-3d.conf

# Désactiver le site par défaut (optionnel)
a2dissite 000-default.conf

# Tester la configuration
apache2ctl configtest

# Recharger Apache
systemctl reload apache2
```

---

## 🚀 Option 3 : Déploiement Simple avec Python (Pour test rapide)

```bash
# Dans le répertoire contenant les fichiers
cd /chemin/vers/calculateur-3d

# Python 3
python3 -m http.server 8080

# Accessible sur http://IP_DU_CONTENEUR:8080
```

---

## 🔒 Option 4 : Avec HTTPS (Certificat SSL)

### Avec Certbot (Let's Encrypt)

```bash
# Installer Certbot
apt install certbot python3-certbot-nginx -y

# Pour Nginx
certbot --nginx -d votre-domaine.com

# Pour Apache
apt install certbot python3-certbot-apache -y
certbot --apache -d votre-domaine.com

# Renouvellement automatique
certbot renew --dry-run
```

---

## 📁 Structure des fichiers sur le serveur

```
/var/www/calculateur-3d/
├── index.html
├── js/
│   └── calculator.js
└── README.md (optionnel)
```

---

## 🔧 Configuration du pare-feu (si nécessaire)

```bash
# UFW (Ubuntu/Debian)
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# iptables
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables-save > /etc/iptables/rules.v4
```

---

## 🌐 Configuration réseau dans Proxmox

### 1. Port Forwarding (si derrière NAT)

Dans l'interface de votre routeur/firewall :
```
Port externe: 80 → IP_CONTENEUR:80
Port externe: 443 → IP_CONTENEUR:443
```

### 2. Accès local uniquement

L'application sera accessible sur votre réseau local via :
```
http://IP_DU_CONTENEUR
```

### 3. Avec nom de domaine local

Éditer `/etc/hosts` sur vos machines clientes :
```bash
IP_DU_CONTENEUR    calculateur-3d.local
```

---

## 📊 Surveillance et Logs

### Nginx
```bash
# Logs d'accès
tail -f /var/log/nginx/calculateur-3d-access.log

# Logs d'erreur
tail -f /var/log/nginx/calculateur-3d-error.log

# Statut
systemctl status nginx
```

### Apache
```bash
# Logs
tail -f /var/log/apache2/calculateur-3d-access.log
tail -f /var/log/apache2/calculateur-3d-error.log

# Statut
systemctl status apache2
```

---

## 🔄 Mise à jour de l'application

```bash
# Se connecter au conteneur
ssh root@IP_DU_CONTENEUR

# Naviguer vers le répertoire
cd /var/www/calculateur-3d

# Sauvegarder l'ancienne version
cp -r /var/www/calculateur-3d /var/www/calculateur-3d.backup

# Mettre à jour les fichiers (via SCP, Git, ou manuellement)
# Exemple avec SCP depuis votre machine :
# scp -r index.html js/ root@IP_DU_CONTENEUR:/var/www/calculateur-3d/

# Recharger le serveur web
systemctl reload nginx  # ou apache2
```

---

## 🐛 Dépannage

### Le site n'est pas accessible

```bash
# Vérifier que le service web fonctionne
systemctl status nginx  # ou apache2

# Vérifier les ports ouverts
netstat -tlnp | grep :80

# Vérifier les logs
tail -f /var/log/nginx/error.log  # ou apache2

# Vérifier les permissions
ls -la /var/www/calculateur-3d
chown -R www-data:www-data /var/www/calculateur-3d
```

### Erreur 404

```bash
# Vérifier que les fichiers sont présents
ls -la /var/www/calculateur-3d/

# Vérifier la configuration Nginx/Apache
nginx -t  # ou apache2ctl configtest
```

### JavaScript ne fonctionne pas

```bash
# Vérifier que le fichier existe
ls -la /var/www/calculateur-3d/js/calculator.js

# Vérifier le type MIME dans la configuration
# Nginx : /etc/nginx/mime.types doit contenir "application/javascript js"
# Apache : vérifier que mod_mime est activé
```

---

## 📦 Sauvegarde

```bash
# Créer une sauvegarde
tar -czf calculateur-3d-backup-$(date +%Y%m%d).tar.gz /var/www/calculateur-3d

# Restaurer
tar -xzf calculateur-3d-backup-YYYYMMDD.tar.gz -C /
```

---

## 🎯 Résumé des commandes rapides

```bash
# Installation complète rapide avec Nginx
apt update && apt install nginx -y
mkdir -p /var/www/calculateur-3d
# Transférer les fichiers
# Configurer Nginx (voir section 6)
nginx -t && systemctl reload nginx
```

---

## 💡 Conseils

1. **Utilisez une IP statique** pour le conteneur LXC
2. **Configurez un nom de domaine local** pour un accès plus facile
3. **Activez HTTPS** si accessible depuis Internet
4. **Faites des sauvegardes régulières** de votre configuration
5. **Surveillez les logs** pour détecter les problèmes

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs du serveur web
2. Testez l'accès en local sur le serveur : `curl http://localhost`
3. Vérifiez le pare-feu et les règles réseau de Proxmox
4. Assurez-vous que les fichiers ont les bonnes permissions

---

**Application déployée avec succès !** 🎉

Accès : `http://IP_DU_CONTENEUR` ou `http://nom-de-domaine.local`