# Dockerfile pour le Calculateur d'Impression 3D
# Image légère basée sur Nginx Alpine

FROM nginx:alpine

# Métadonnées
LABEL maintainer="votre-email@example.com"
LABEL description="Calculateur de prix d'impression 3D - Application web statique"
LABEL version="3.5.0"

# Copier les fichiers de l'application dans le répertoire Nginx
COPY index.html /usr/share/nginx/html/
COPY favicon.svg /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/
COPY images/ /usr/share/nginx/html/images/
COPY Documentation/ /usr/share/nginx/html/Documentation/
COPY README.md /usr/share/nginx/html/
COPY *.html /usr/share/nginx/html/

# Configuration Nginx personnalisée (optionnel)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Définir les permissions
RUN chmod -R 755 /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Commande de démarrage (définie par l'image nginx:alpine)
# CMD ["nginx", "-g", "daemon off;"]