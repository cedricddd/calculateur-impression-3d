FROM node:20-alpine

LABEL maintainer="cedric@ced-it.be"
LABEL description="Calculateur de prix d'impression 3D - Ced-IT"
LABEL version="4.0.0"

WORKDIR /app

# Dépendances Node
COPY package*.json ./
RUN npm ci --only=production

# Serveur + auth
COPY server.js ./
COPY auth/ ./auth/
COPY middleware/ ./middleware/

# Fichiers statiques dans public/
COPY index.html favicon.svg ./public/
COPY js/   ./public/js/
COPY css/  ./public/css/
COPY images/ ./public/images/

EXPOSE 3080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3080/health || exit 1

CMD ["node", "server.js"]
