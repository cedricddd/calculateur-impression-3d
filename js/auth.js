/**
 * auth.js — Authentification SSO pour le Calculateur d'Impression 3D
 * Application vanilla JS — pas de build, pas de module bundler
 *
 * Flow :
 * 1. Un overlay de chargement est affiché depuis le HTML (id="auth-overlay")
 * 2. Ce script vérifie le token JWT (URL → sessionStorage → API SaaS)
 * 3. Si valide → supprime l'overlay + affiche bannière trial si nécessaire
 * 4. Si invalide → remplace l'overlay par un écran "accès requis" puis redirige
 */

(function () {
  'use strict';

  var SAAS_URL   = 'https://saas.ced-it.be';
  var APP_SLUG   = 'calculateur-3d';
  var APP_URL    = 'https://calculateur-impression-3d.ced-it.be';
  var TOKEN_KEY  = 'saas_token_' + APP_SLUG;

  function getSsoLoginUrl() {
    var redirectUrl = APP_URL + '/';
    return SAAS_URL + '/auth/app-login?appSlug=' + encodeURIComponent(APP_SLUG) +
      '&redirectUrl=' + encodeURIComponent(redirectUrl);
  }

  function consumeTokenFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var token = params.get('token');
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
      params.delete('token');
      var clean = params.toString()
        ? window.location.pathname + '?' + params.toString()
        : window.location.pathname;
      window.history.replaceState({}, '', clean);
      return token;
    }
    return null;
  }

  function getStoredToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  function clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  function decodePayload(token) {
    try {
      var parts = token.split('.');
      if (parts.length !== 3) return null;
      var b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      var pad = b64.length % 4;
      if (pad) b64 += '==='.slice(0, 4 - pad);
      return JSON.parse(atob(b64));
    } catch (e) { return null; }
  }

  function isExpiredLocally(token) {
    var p = decodePayload(token);
    if (!p || !p.exp) return true;
    return Math.floor(Date.now() / 1000) >= p.exp;
  }

  function verifyWithSaas(token) {
    return fetch(SAAS_URL + '/api/apps/' + APP_SLUG + '/verify', {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(function (res) {
      if (!res.ok) return null;
      return res.json();
    }).catch(function () { return null; });
  }

  /* ---- UI helpers ---- */

  function showUnauthorized(overlay) {
    overlay.innerHTML = [
      '<div style="display:flex;flex-direction:column;align-items:center;gap:24px;max-width:360px;text-align:center;padding:24px">',
        '<div style="width:64px;height:64px;border-radius:50%;background:rgba(0,212,255,0.1);display:flex;align-items:center;justify-content:center">',
          '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2">',
            '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>',
            '<path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
          '</svg>',
        '</div>',
        '<div>',
          '<h2 style="color:#fff;font-size:20px;font-weight:600;margin-bottom:8px">Accès requis</h2>',
          '<p style="color:#94a3b8;font-size:14px">Connectez-vous ou démarrez votre essai gratuit de 24h pour utiliser le calculateur d\'impression 3D.</p>',
        '</div>',
        '<button id="auth-login-btn" style="width:100%;padding:12px 24px;border-radius:8px;border:none;color:#fff;font-weight:500;font-size:14px;cursor:pointer;background:linear-gradient(135deg,#00d4ff 0%,#0066ff 100%)">',
          'Se connecter via Ced-IT',
        '</button>',
        '<a href="' + SAAS_URL + '/apps/' + APP_SLUG + '" style="color:#00d4ff;font-size:14px;text-decoration:none">',
          'Voir les offres →',
        '</a>',
      '</div>'
    ].join('');

    var btn = document.getElementById('auth-login-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        window.location.href = getSsoLoginUrl();
      });
    }
  }

  function injectTrialBanner(trialExpiresAt) {
    var banner = document.createElement('div');
    banner.id = 'trial-banner';
    banner.style.cssText = [
      'position:fixed;top:0;left:0;right:0;z-index:9998',
      'display:flex;align-items:center;justify-content:space-between',
      'padding:8px 16px;font-size:13px;font-family:sans-serif',
      'background:linear-gradient(135deg,rgba(0,212,255,0.13) 0%,rgba(0,102,255,0.13) 100%)',
      'border-bottom:1px solid rgba(0,212,255,0.3)'
    ].join(';');

    function getHoursLeft() {
      if (!trialExpiresAt) return null;
      var diff = new Date(trialExpiresAt).getTime() - Date.now();
      return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60)) : 0;
    }

    function updateBanner() {
      var h = getHoursLeft();
      var hoursText = h !== null ? h + 'h restante' + (h > 1 ? 's' : '') : '…';
      banner.innerHTML = [
        '<div style="display:flex;align-items:center;gap:8px;color:#94a3b8">',
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2">',
            '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
          '</svg>',
          '<span>Essai gratuit — <strong style="color:#fff">' + hoursText + '</strong></span>',
          '<a href="' + SAAS_URL + '/apps/' + APP_SLUG + '" style="color:#00d4ff;text-decoration:none;margin-left:8px">Passer à l\'abonnement →</a>',
        '</div>',
        '<button id="trial-banner-close" style="background:none;border:none;color:#64748b;cursor:pointer;font-size:14px" aria-label="Fermer">✕</button>'
      ].join('');

      var closeBtn = document.getElementById('trial-banner-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          banner.remove();
          document.body.style.paddingTop = '';
        });
      }
    }

    updateBanner();
    setInterval(updateBanner, 60000);

    document.body.insertBefore(banner, document.body.firstChild);
    document.body.style.paddingTop = '40px';
  }

  /* ---- Auth flow (async IIFE) ---- */

  (async function checkAccess() {
    consumeTokenFromUrl();

    var token = getStoredToken();
    var overlay = document.getElementById('auth-overlay');

    if (!token || isExpiredLocally(token)) {
      clearToken();
      if (overlay) showUnauthorized(overlay);
      setTimeout(function () {
        window.location.href = getSsoLoginUrl();
      }, 3000);
      return;
    }

    var access = await verifyWithSaas(token);

    if (!access || !access.hasAccess) {
      clearToken();
      if (overlay) showUnauthorized(overlay);
      setTimeout(function () {
        window.location.href = getSsoLoginUrl();
      }, 3000);
      return;
    }

    /* ---- Accès autorisé ---- */
    if (overlay) overlay.remove();

    if (access.accessType === 'trial') {
      injectTrialBanner(access.trialExpiresAt);
    }
  })();

})();
