// api/admin/logout.js
const { withAuth } = require('../_lib/auth');

module.exports = withAuth(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  res.setHeader('Set-Cookie', 'cdp_admin=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/');
  return res.status(200).json({ ok: true });
});
