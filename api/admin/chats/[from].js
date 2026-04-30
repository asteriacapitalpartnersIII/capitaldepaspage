// api/admin/chats/[from].js
// Handles all per-chat operations:
//   GET  /api/admin/chats/:from              — full transcript
//   POST /api/admin/chats/:from/takeover     — flip aiActive=false
//   POST /api/admin/chats/:from/release      — flip aiActive=true
//   POST /api/admin/chats/:from/send         — send human message via Twilio
//   POST /api/admin/chats/:from/delete       — wipe chat key from KV
const { withAuth } = require('../../_lib/auth');
const { kv } = require('@vercel/kv');
const sendWhatsApp = require('../../_lib/twilio');

module.exports = withAuth(async function handler(req, res) {
  const { from: rawFrom, action } = req.query;
  // Vercel catches /api/admin/chats/[from] AND /api/admin/chats/[from]/[action]
  // The action is passed as a separate query param when using [...slug] — but
  // with the [from].js + subdirectory approach, action comes as a separate segment.
  // We route by: if action exists, it's a sub-action. Otherwise it's a GET.
  const from = decodeURIComponent(rawFrom || '');
  if (!from) return res.status(400).end();

  const key = 'chat:' + from;

  // ── GET full transcript ──────────────────────────────────────────────────
  if (req.method === 'GET' && !action) {
    const chat = await kv.get(key);
    if (!chat) return res.status(404).json({ error: 'not found' });
    return res.status(200).json(chat);
  }

  // ── POST sub-actions ─────────────────────────────────────────────────────
  if (req.method !== 'POST') return res.status(405).end();

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  const chat = await kv.get(key);
  if (!chat && action !== 'delete') return res.status(404).json({ error: 'not found' });

  if (action === 'takeover') {
    const updated = { ...chat, aiActive: false, takenOverAt: Date.now() };
    await kv.set(key, updated);
    return res.status(200).json(updated);
  }

  if (action === 'release') {
    const updated = { ...chat, aiActive: true };
    await kv.set(key, updated);
    return res.status(200).json(updated);
  }

  if (action === 'send') {
    const msgBody = String(body.body || '').trim();
    if (!msgBody) return res.status(400).json({ error: 'body required' });
    await sendWhatsApp(from, msgBody);
    const history = [...(chat.history || []), { role: 'human', content: msgBody, ts: Date.now() }];
    const updated = { ...chat, history, lastMessageAt: Date.now() };
    await kv.set(key, updated);
    return res.status(200).json(updated);
  }

  if (action === 'delete') {
    await kv.del(key);
    return res.status(200).json({ ok: true });
  }

  return res.status(404).end();
});
