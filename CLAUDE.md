# Calculateur Impression 3D — Ced-IT

## Stack
- **Frontend** : HTML + CSS + JS vanilla (`public/index.html`, `public/js/calculator.js`)
- **Backend** : Node.js + Express (`server.js`, port 3080)
- **Auth** : SSO JWT depuis ced-it-saas (`middleware/auth.js`, `auth/verify-token.js`)
- **Déploiement** : Docker (Portainer), port 3080

## Intégration SaaS
- App slug : `calculateur-3d`
- Token JWT vérifié via `APP_TOKEN_SECRET` (env)
- Callback SSO : `GET /callback?token=...` → cookie `calc3d_token`
- Redirect si accès refusé → `${SAAS_URL}/apps/calculateur-3d?upgrade=true`

## Fichiers clés
```
calculateur-impression-3d/
├── server.js              # Express + SSO callback + static serving
├── middleware/auth.js     # Vérification cookie JWT sur toutes les routes
├── auth/verify-token.js   # Décodage JWT
├── public/
│   ├── index.html         # App principale
│   └── js/calculator.js   # Logique de calcul (matériaux, prix, poids)
├── Dockerfile             # node:20-alpine, WORKDIR /app, PORT 3080
└── .env                   # APP_TOKEN_SECRET, SAAS_URL, APP_URL
```

## Variables d'environnement
```env
APP_TOKEN_SECRET=...        # Partagé avec ced-it-saas
SAAS_URL=https://saas.ced-it.be
APP_URL=https://calculateur-impression-3d.ced-it.be
PORT=3080
```

## Commandes
```bash
rtk pnpm install     # Installer les dépendances (90% token savings)
node server.js       # Lancer en local (port 3080)
docker compose up -d # Lancer via Docker
```

> Toujours préfixer avec `rtk` : `rtk pnpm install`, `rtk git *` (59-97%)

## Déploiement
SSH sur le NAS → Portainer → Stack `calculateur-impression-3d` → Pull & Redeploy.
Ou via le skill global `/deploy` (détecte automatiquement).

## Règles de développement
- Ne jamais exposer `APP_TOKEN_SECRET` dans le code
- La route `/health` est publique (healthcheck Docker)
- Toutes les autres routes passent par `authMiddleware`
- Le cookie SSO s'appelle `calc3d_token` (httpOnly, secure en prod)
