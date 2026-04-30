// api/admin/logout-all.js — Force-logout ALL sessions (auth-required)
// Bumps session_epoch in KV. All existing cookies whose HMAC was signed with
// the old epoch become invalid immediately. No redeploy required.
// Both admin and mom must log in again after calling this endpoint.
const { withAuth } = require('../_lib/auth');
const { kv } = require('@vercel/kv');

module.exports = withAuth(async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

                            // Read current epoch, bump it
                            const current = (await kv.get('session_epoch')) || 0;
    const next = Number(current) + 1;
    await kv.set('session_epoch', next);

                            // Clear the caller's own cookie so they must re-login immediately
                            res.setHeader('Set-Cookie', [
                                  'cdp_admin=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/'
                                ]);

                            return res.status(200).json({ ok: true, epoch: next, message: 'Todas las sesiones cerradas. Inicia sesión nuevamente.' });
});
