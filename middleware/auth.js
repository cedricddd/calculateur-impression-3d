const { verifyAppToken } = require('../auth/verify-token');

const APP_SLUG = 'calculateur-3d';

module.exports = function authMiddleware(req, res, next) {
  if (req.path === '/callback' || req.path === '/health') return next();

  // Dev local : désactiver l'auth (DISABLE_AUTH=true dans .env.local)
  if (process.env.DISABLE_AUTH === 'true') {
    req.user = { appSlug: APP_SLUG, email: 'dev@local', hasAccess: true }
    return next()
  }

  const secret  = process.env.APP_TOKEN_SECRET;
  const saasUrl = process.env.SAAS_URL || 'https://saas.ced-it.be';
  const appUrl  = process.env.APP_URL  || 'https://calculateur-impression-3d.ced-it.be';
  const loginUrl = `${saasUrl}/auth/app-login?appSlug=${APP_SLUG}&redirectUrl=${encodeURIComponent(appUrl + '/callback')}`;

  if (!secret) {
    console.error('[Auth] APP_TOKEN_SECRET manquant');
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'Configuration serveur incorrecte', loginUrl });
    }
    return res.redirect(loginUrl);
  }

  const token   = req.cookies?.calc3d_token;
  const payload = token ? verifyAppToken(token, secret) : null;

  if (payload && payload.appSlug === APP_SLUG && payload.hasAccess) {
    req.user = payload;
    return next();
  }

  if (token) res.clearCookie('calc3d_token');

  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Session expirée', loginUrl });
  }

  res.redirect(loginUrl);
};
