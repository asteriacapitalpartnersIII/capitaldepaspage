// api/admin/login.js
// Security hardening:
// a) Rate limiting: 5 failures per IP in 15 min -> 429
// b) New-IP alert: WhatsApp to mom on first login from unknown IP
// c) 24h cookie expiry (down from 7 days)
// d) Login attempt logging to KV for audit trail
// e) Recovery: GET ?recover=TOKEN sets a session cookie without needing password
//
// KV access: raw Upstash REST fetch — no @vercel/kv dependency needed.
const { timingSafeEqual, createHash } = require('crypto');
const { signToken } = require('../_lib/auth');
const sendWhatsApp = require('../_lib/twilio');

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60; // seconds
const COOKIE_TTL = 24 * 60 * 60;   // 24 hours in seconds
const LOG_TTL = 30 * 24 * 60 * 60; // 30 days
const KNOWN_IP_TTL = 60 * 24 * 60 * 60; // 60 days

// ── Tiny KV helper ──
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
const kvGet    = (k)         => kvCmd(['GET', k]);
const kvSet    = (k, v, ex)  => kvCmd(ex ? ['SET', k, String(v), 'EX', String(ex)] : ['SET', k, String(v)]);
const kvIncr   = (k)         => kvCmd(['INCR', k]);
const kvExpire = (k, s)      => kvCmd(['EXPIRE', k, String(s)]);
const kvDel    = (k)         => kvCmd(['DEL', k]);

function getIp(req) {
  const fwd = req.headers['x-forwarded-for'] || '';
  return fwd.split(',')[0].trim() || 'unknown';
}

function hashIp(ip) {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

async function logAttempt(ip, success) {
  const ts = Date.now();
  const ipHash = hashIp(ip);
  const key = 'loginlog:' + ts + ':' + ipHash;
  const val = JSON.stringify({ ts, ipHash, success, at: new Date(ts).toISOString() });
  await kvSet(key, val, LOG_TTL).catch(() => {});
}

async function issueSessionCookie(req, res) {
  let epoch = 0;
  try { epoch = Number(await kvGet('session_epoch')) || 0; } catch {}
  const exp = Date.now() + COOKIE_TTL * 1000;
  const hmac = signToken(exp, epoch);
  const token = exp + '.' + epoch + '.' + hmac;
  res.setHeader('Set-Cookie', [
    `cdp_admin=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_TTL}; Path=/`
  ]);
}

module.exports = async function handler(req, res) {

  // ── e) Recovery via GET ?recover=TOKEN ──────────────────────────────────
  // Usage: visit https://www.capitaldepas.com/api/admin/login?recover=YOUR_TOKEN
  // Sets a 24h session cookie and redirects to /admin.
  // Requires ADMIN_RECOVERY_TOKEN env var set in Vercel.
  if (req.method === 'GET') {
    const recoveryToken = process.env.ADMIN_RECOVERY_TOKEN || '';
    const supplied = String(req.query && req.query.recover || '');
    if (!recoveryToken || !supplied) return res.status(400).send('Recovery not configured.');
    const a = Buffer.from(recoveryToken.padEnd(128));
    const b = Buffer.from(supplied.padEnd(128));
    let match = false;
    try { match = timingSafeEqual(a, b) && supplied === recoveryToken; } catch {}
    if (!match) {
      await logAttempt(getIp(req), false).catch(() => {});
      return res.status(401).send('Invalid recovery token.');
    }
    await issueSessionCookie(req, res);
    await logAttempt(getIp(req), true).catch(() => {});
    res.setHeader('Location', '/admin');
    return res.status(302).end();
  }

  if (req.method !== 'POST') return res.status(405).end();

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  const ip = getIp(req);
  const ipHash = hashIp(ip);
  const rateKey = 'loginfail:' + ipHash;

  // ── a) Rate limiting ──
  let failCount = 0;
  try { failCount = Number(await kvGet(rateKey)) || 0; } catch {}
  if (failCount >= RATE_LIMIT_MAX) {
    await logAttempt(ip, false).catch(() => {});
    res.setHeader('Retry-After', String(RATE_LIMIT_WINDOW));
    return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
  }

  // ── Password compare ──
  const password = process.env.ADMIN_PASSWORD || '';
  const supplied = String(body.password || '');
  const a = Buffer.from(password.padEnd(64));
  const b = Buffer.from(supplied.padEnd(64));
  const match = timingSafeEqual(a, b) && supplied === password;

  if (!match) {
    try { await kvIncr(rateKey); await kvExpire(rateKey, RATE_LIMIT_WINDOW); } catch {}
    await logAttempt(ip, false).catch(() => {});
    return res.status(401).end();
  }

  // ── Login success ──
  await kvDel(rateKey).catch(() => {});
  await logAttempt(ip, true).catch(() => {});

  // ── b) New-IP alert ──
  try {
    const knownKey = 'knownip:' + ipHash;
    const known = await kvGet(knownKey);
    if (!known) {
      const momNumber = process.env.MOM_WHATSAPP_NUMBER;
      if (momNumber) {
        await sendWhatsApp(
          momNumber,
          'Nuevo acceso al panel admin de Capital Depas desde una IP desconocida. Si no fuiste tu, cambia la contrasena en Vercel ahora: https://vercel.com'
        ).catch(e => console.error('new-ip alert failed', e));
      }
      await kvSet(knownKey, '1', KNOWN_IP_TTL);
    }
  } catch (e) { console.error('new-ip check failed (non-fatal)', e); }

  // ── Build 24h cookie ──
  await issueSessionCookie(req, res);
  return res.status(200).json({ ok: true });
};
