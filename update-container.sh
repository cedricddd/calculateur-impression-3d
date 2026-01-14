#!/bin/bash
# Script pour mettre à jour index.html dans le container Docker

echo "🔄 Mise à jour de index.html dans le container..."

# Copier le fichier modifié
docker cp index.html calculateur-impression-3d:/usr/share/nginx/html/index.html

# Vérifier
docker exec calculateur-impression-3d ls -lh /usr/share/nginx/html/index.html

# Recharger Nginx
docker exec calculateur-impression-3d nginx -s reload

echo "✅ Mise à jour terminée!"
echo "🔗 Testez sur : http://votre-serveur:3080"
