// api/_lib/auth.js — HMAC-signed cookie auth middleware
// Wraps admin API endpoints. Returns 401 on any auth failure,
// deliberately avoiding specifics (no 'cookie missing' vs 'expired').
//
// Session epoch: stored in KV as session_epoch (integer).
// Each cookie HMAC covers both exp and epoch. Bumping the epoch in KV
// (via /api/admin/logout?all=1) invalidates ALL existing cookies instantly.
//
// KV access: raw Upstash REST fetch — no @vercel/kv dependency needed.
const { createHmac, timingSafeEqual } = require('crypto');

// ── Tiny KV helper (matches whatsapp.js pattern) ──
function kvCmd(cmd) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return Promise.resolve(null);
  return fetch(url, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  }).then(r => r.ok ? r.json().then(j => j.result) : null).catch(() => null);
}
const kvGet = (k) => kvCmd(['GET', k]);

function signToken(exp, epoch) {
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  const payload = String(exp) + ':' + String(epoch || 0);
  return createHmac('sha256', secret).update(payload).digest('hex');
}

async function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const dot = token.indexOf('.');
  if (dot < 0) return false;
  const exp = token.slice(0, dot);
  const rest = token.slice(dot + 1);

  // Format: {exp}.{epoch}.{hmac} (new) OR {exp}.{hmac} (legacy pre-epoch)
  const dot2 = rest.indexOf('.');
  let epoch, hmac;
  if (dot2 >= 0) {
    epoch = rest.slice(0, dot2);
    hmac = rest.slice(dot2 + 1);
  } else {
    epoch = '0';
    hmac = rest;
  }

  const expected = signToken(exp, epoch);
  try {
    if (!timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))) return false;
  } catch { return false; }

  if (parseInt(exp, 10) <= Date.now()) return false;

  // Check session_epoch in KV (fail open if KV is down)
  try {
    const currentEpoch = (await kvGet('session_epoch')) || 0;
    if (Number(epoch) < Number(currentEpoch)) return false;
  } catch { /* KV down — fail open */ }

  return true;
}

function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return Object.fromEntries(raw.split(';').map(c => {
    const i = c.indexOf('=');
    return i < 0 ? [c.trim(), ''] : [c.slice(0, i).trim(), c.slice(i + 1).trim()];
  }));
}

function withAuth(handler) {
  return async (req, res) => {
    const cookies = parseCookies(req);
    if (!(await verifyToken(cookies.cdp_admin || ''))) {
      return res.status(401).end();
    }
    return handler(req, res);
  };
}

module.exports = { withAuth, signToken };
