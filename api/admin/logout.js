// api/admin/logout.js
// POST /api/admin/logout       — single session logout
// POST /api/admin/logout?all=1 — force-logout ALL sessions via session_epoch bump
//
// KV access: raw Upstash REST fetch — no @vercel/kv dependency needed.
const { withAuth } = require('../_lib/auth');

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
const kvSet = (k, v) => kvCmd(['SET', k, String(v)]);

module.exports = withAuth(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const logoutAll = req.query && (req.query.all === '1' || req.query.all === 'true');

  if (logoutAll) {
    // Bump session_epoch — invalidates ALL existing cookies instantly
    const current = (await kvGet('session_epoch').catch(() => null)) || 0;
    const next = Number(current) + 1;
    await kvSet('session_epoch', next).catch(() => {});
  }

  // Clear caller's cookie
  res.setHeader('Set-Cookie', 'cdp_admin=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/');
  return res.status(200).json({ ok: true, logoutAll: !!logoutAll });
});
