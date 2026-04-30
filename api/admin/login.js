// api/admin/login.js
// Security hardening (Step 4):
//   a) Rate limiting: 5 failures per IP in 15 min -> 429
//   b) New-IP alert: WhatsApp to mom on first login from unknown IP
//   c) 24h cookie expiry (down from 7 days)
//   d) Login attempt logging to KV for audit trail
const { timingSafeEqual, createHash } = require('crypto');
const { signToken } = require('../_lib/auth');
const { kv } = require('@vercel/kv');
const sendWhatsApp = require('../_lib/twilio');

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60; // 15 minutes in seconds
const COOKIE_TTL = 24 * 60 * 60;   // 24 hours in seconds
const LOG_TTL = 30 * 24 * 60 * 60; // 30 days in seconds
const KNOWN_IP_TTL = 60 * 24 * 60 * 60; // 60 days in seconds

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
    await kv.set(key, { ts, ipHash, success, at: new Date(ts).toISOString() }, { ex: LOG_TTL });
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    let body = req.body;
    if (typeof body === 'string') {
          try { body = JSON.parse(body); } catch { body = {}; }
    }
    body = body || {};

    const ip = getIp(req);
    const ipHash = hashIp(ip);
    const rateKey = 'loginfail:' + ipHash;

    // ── a) Rate limiting ──────────────────────────────────────────────────────
    let failCount = 0;
    try {
          failCount = Number(await kv.get(rateKey)) || 0;
    } catch { /* KV down — fail open */ }

    if (failCount >= RATE_LIMIT_MAX) {
          try { await logAttempt(ip, false); } catch {}
          res.setHeader('Retry-After', String(RATE_LIMIT_WINDOW));
          return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
    }

    // ── Password compare ──────────────────────────────────────────────────────
    const password = process.env.ADMIN_PASSWORD || '';
    const supplied = String(body.password || '');

    const a = Buffer.from(password.padEnd(64));
    const b = Buffer.from(supplied.padEnd(64));
    const match = timingSafeEqual(a, b) && supplied === password;

    if (!match) {
          // Increment fail counter with TTL
      try {
              await kv.incr(rateKey);
              await kv.expire(rateKey, RATE_LIMIT_WINDOW);
      } catch {}
          try { await logAttempt(ip, false); } catch {}
          return res.status(401).end();
    }

    // ── Login success ─────────────────────────────────────────────────────────
    // Clear fail counter
    try { await kv.del(rateKey); } catch {}

    // Log the success
    try { await logAttempt(ip, true); } catch {}

    // ── b) New-IP alert ───────────────────────────────────────────────────────
    try {
          const knownKey = 'knownip:' + ipHash;
          const known = await kv.get(knownKey);
          if (!known) {
                  const momNumber = process.env.MOM_WHATSAPP_NUMBER;
                  if (momNumber) {
                            await sendWhatsApp(
                                        momNumber,
                                        'Nuevo acceso al panel admin de Capital Depas desde una IP desconocida. Si no fuiste tu o tu hijo, cambia la contrasena en Vercel ahora: https://vercel.com'
                                      ).catch(e => console.error('new-ip alert failed', e));
                  }
                  await kv.set(knownKey, '1', { ex: KNOWN_IP_TTL });
          }
    } catch (e) {
          console.error('new-ip check failed (non-fatal)', e);
    }

    // ── Build 24h cookie ──────────────────────────────────────────────────────
    // Fetch current session_epoch for HMAC
    let epoch = 0;
    try { epoch = Number(await kv.get('session_epoch')) || 0; } catch {}

    const exp = Date.now() + COOKIE_TTL * 1000;
    const hmac = signToken(exp, epoch);
    const token = exp + '.' + epoch + '.' + hmac;

    res.setHeader('Set-Cookie', [
          `cdp_admin=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_TTL}; Path=/`
        ]);
    return res.status(200).json({ ok: true });
};
