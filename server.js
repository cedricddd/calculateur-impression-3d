const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/auth');
const { verifyAppToken } = require('./auth/verify-token');

const app  = express();
const PORT = process.env.PORT || 3080;

app.use(express.json());
app.use(cookieParser());

// ── Santé (non protégée — utilisée par le healthcheck Docker) ────────────────
app.get('/health', (req, res) => res.json({ ok: true }));

// ── Callback SSO — reçoit le token depuis le SaaS ───────────────────────────
app.get('/callback', (req, res) => {
  const { token } = req.query;
  const saasUrl   = process.env.SAAS_URL || 'https://saas.ced-it.be';

  if (!token) return res.redirect('/');

  const secret  = process.env.APP_TOKEN_SECRET;
  const payload = secret ? verifyAppToken(token, secret) : null;

  if (!payload || payload.appSlug !== 'calculateur-3d' || !payload.hasAccess) {
    return res.redirect(`${saasUrl}/apps/calculateur-3d?upgrade=true`);
  }

  const maxAge = (payload.exp - Math.floor(Date.now() / 1000)) * 1000;
  res.cookie('calc3d_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
  });

  res.redirect('/');
});

// ── Toutes les routes ci-dessous nécessitent un token valide ─────────────────
app.use(authMiddleware);

// ── API : profil entreprise — proxy vers le SaaS ─────────────────────────────
app.get('/api/profile', async (req, res) => {
  const saasUrl = process.env.SAAS_URL || 'https://saas.ced-it.be';
  const token   = req.cookies?.calc3d_token;

  try {
    const profileRes = await fetch(`${saasUrl}/api/apps/calculateur-3d/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!profileRes.ok) return res.json({ profile: null, logoBase64: null });

    const { profile } = await profileRes.json();
    if (!profile) return res.json({ profile: null, logoBase64: null });

    // Charger le logo en base64 côté serveur (pas de CORS côté client)
    let logoBase64 = null;
    if (profile.logoPath) {
      try {
        const logoRes = await fetch(`${saasUrl}${profile.logoPath}`);
        if (logoRes.ok) {
          const buffer      = await logoRes.arrayBuffer();
          const contentType = logoRes.headers.get('content-type') || 'image/png';
          logoBase64 = `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`;
        }
      } catch (_) {}
    }

    res.json({ profile, logoBase64 });
  } catch (_) {
    res.json({ profile: null, logoBase64: null });
  }
});

// ── Fichiers statiques ────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

// ── SPA fallback ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Calculateur 3D running on http://localhost:${PORT}`);
});
