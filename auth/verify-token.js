const { createHmac } = require('crypto');

function base64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlDecode(input) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  return Buffer.from(pad ? padded + '='.repeat(4 - pad) : padded, 'base64');
}

function verifyAppToken(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, sig] = parts;
    const signing = `${header}.${body}`;
    const expected = base64url(createHmac('sha256', secret).update(signing).digest());

    if (expected !== sig) return null;

    const payload = JSON.parse(base64urlDecode(body).toString('utf-8'));

    if (Math.floor(Date.now() / 1000) > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

module.exports = { verifyAppToken };
