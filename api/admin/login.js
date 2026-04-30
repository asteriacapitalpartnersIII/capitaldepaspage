// api/admin/login.js
const { timingSafeEqual } = require('crypto');
const { signToken } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const password = process.env.ADMIN_PASSWORD || '';
  const supplied = String(body.password || '');

  // Constant-time compare (pad to same length to avoid length oracle)
  const a = Buffer.from(password.padEnd(64));
  const b = Buffer.from(supplied.padEnd(64));
  const match = timingSafeEqual(a, b) && supplied === password;

  if (!match) return res.status(401).end();

  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const hmac = signToken(exp);
  const token = exp + '.' + hmac;

  res.setHeader('Set-Cookie', [
    `cdp_admin=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/`
  ]);
  return res.status(200).json({ ok: true });
};
