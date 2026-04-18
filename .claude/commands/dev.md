---
name: dev
description: Lancer le calculateur 3D en local (Express + SSO). Gère le démarrage du serveur et le test du flux d'authentification.
---

# Dev — Calculateur Impression 3D

## Démarrer le serveur

```bash
npm install       # Si première fois
node server.js    # Port 3080
```

Ou via Docker :
```bash
docker compose up -d
```

## Variables d'environnement requises

Créer `.env` si inexistant :
```env
APP_TOKEN_SECRET=...   # Récupérer dans ced-it-saas/.env
SAAS_URL=http://localhost:3003
APP_URL=http://localhost:3080
PORT=3080
```

## Tester le flux SSO

1. Démarrer ced-it-saas en parallèle (`cd ../ced-it-saas && npm run dev`)
2. Aller sur `http://localhost:3003/apps/calculateur-3d`
3. Démarrer un essai gratuit → redirect vers `http://localhost:3080/callback?token=...`
4. Vérifier que le cookie `calc3d_token` est bien créé

## Endpoints disponibles

| Route | Accès | Description |
|-------|-------|-------------|
| `GET /health` | Public | Healthcheck Docker |
| `GET /callback?token=...` | Public | Réception token SSO |
| `GET /` | Protégé | App principale |

## Logs de debug SSO

Si le token est refusé, vérifier :
- `APP_TOKEN_SECRET` identique entre les deux apps
- `payload.appSlug === 'calculateur-3d'`
- `payload.hasAccess === true`
- Token non expiré

$ARGUMENTS
