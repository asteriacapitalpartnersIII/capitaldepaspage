// api/admin/logout.js
// POST /api/admin/logout           — single session logout
// POST /api/admin/logout?all=1     — force-logout ALL sessions via session_epoch bump
const { withAuth } = require('../_lib/auth');
const { kv } = require('@vercel/kv');

module.exports = withAuth(async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

                            const logoutAll = req.query && (req.query.all === '1' || req.query.all === 'true');

                            if (logoutAll) {
                                  // Bump session_epoch — invalidates ALL existing cookies
      const current = (await kv.get('session_epoch').catch(() => 0)) || 0;
                                  const next = Number(current) + 1;
                                  await kv.set('session_epoch', next);
                            }

                            // Clear caller's cookie
                            res.setHeader('Set-Cookie', 'cdp_admin=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/');
    return res.status(200).json({ ok: true, logoutAll: !!logoutAll });
});
