// api/admin/chats/[from].js
// Handles all per-chat operations:
//   GET  /api/admin/chats/:from           — full transcript
//   POST /api/admin/chats/:from/takeover  — flip aiActive=false
//   POST /api/admin/chats/:from/release   — flip aiActive=true
//   POST /api/admin/chats/:from/send      — send human message via Twilio
//   POST /api/admin/chats/:from/delete    — wipe chat key from KV
//
// KV access: raw Upstash REST fetch — no @vercel/kv dependency needed.
const { withAuth } = require('../../_lib/auth');
const sendWhatsApp = require('../../_lib/twilio');

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
const kvSet = (k, v) => kvCmd(['SET', k, typeof v === 'string' ? v : JSON.stringify(v)]);
const kvDel = (k) => kvCmd(['DEL', k]);

module.exports = withAuth(async function handler(req, res) {
  const { from: rawFrom, action } = req.query;
  const from = decodeURIComponent(rawFrom || '');
  if (!from) return res.status(400).end();

  const key = 'chat:' + from;

  // ── GET full transcript ──
  if (req.method === 'GET' && !action) {
    const raw = await kvGet(key);
    if (!raw) return res.status(404).json({ error: 'not found' });
    const chat = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return res.status(200).json(chat);
  }

  // ── POST sub-actions ──
  if (req.method !== 'POST') return res.status(405).end();

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  const raw = await kvGet(key);
  const chat = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : null;

  if (!chat && action !== 'delete') return res.status(404).json({ error: 'not found' });

  if (action === 'takeover') {
    const updated = { ...chat, aiActive: false, takenOverAt: Date.now() };
    await kvSet(key, updated);
    return res.status(200).json(updated);
  }

  if (action === 'release') {
    const updated = { ...chat, aiActive: true };
    await kvSet(key, updated);
    return res.status(200).json(updated);
  }

  if (action === 'send') {
    const msgBody = String(body.body || '').trim();
    if (!msgBody) return res.status(400).json({ error: 'body required' });
    await sendWhatsApp(from, msgBody);
    const history = [...(chat.history || []), { role: 'human', content: msgBody, ts: Date.now() }];
    const updated = { ...chat, history, lastMessageAt: Date.now() };
    await kvSet(key, updated);
    return res.status(200).json(updated);
  }

  if (action === 'delete') {
    await kvDel(key);
    return res.status(200).json({ ok: true });
  }

  return res.status(404).end();
});
