// api/_lib/auth.js — HMAC-signed cookie auth middleware
// Wraps admin API endpoints. Returns 401 on any auth failure,
// deliberately avoiding specifics (no 'cookie missing' vs 'expired').

const { createHmac, timingSafeEqual } = require('crypto');

function signToken(exp) {
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  return createHmac('sha256', secret).update(String(exp)).digest('hex');
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const dot = token.indexOf('.');
  if (dot < 0) return false;
  const exp = token.slice(0, dot);
  const hmac = token.slice(dot + 1);
  const expected = signToken(exp);
  try {
    if (!timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))) return false;
  } catch { return false; }
  return parseInt(exp, 10) > Date.now();
}

function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return Object.fromEntries(raw.split(';').map(c => {
    const i = c.indexOf('=');
    return i < 0 ? [c.trim(), ''] : [c.slice(0, i).trim(), c.slice(i + 1).trim()];
  }));
}

// Returns the handler wrapped with auth. On success, handler is called.
// On fail: 401, no body.
function withAuth(handler) {
  return async (req, res) => {
    const cookies = parseCookies(req);
    if (!verifyToken(cookies.cdp_admin || '')) {
      return res.status(401).end();
    }
    return handler(req, res);
  };
}

module.exports = { withAuth, signToken };
