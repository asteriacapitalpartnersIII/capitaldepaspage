// api/admin/chats.js
// GET /api/admin/chats       — list of all chats
// GET /api/admin/chats?log=1 — login activity log (last 100 entries)
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
const kvGet  = (k) => kvCmd(['GET', k]);
const kvScan = (cursor, match, count) => kvCmd(['SCAN', String(cursor), 'MATCH', match, 'COUNT', String(count || 100)]);

module.exports = withAuth(async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  // ── Login activity log ──
  if (req.query && req.query.log === '1') {
    const keys = [];
    let cursor = 0;
    do {
      const result = await kvScan(cursor, 'loginlog:*', 200);
      if (!result) break;
      const [nextCursor, batch] = result;
      keys.push(...(batch || []));
      cursor = Number(nextCursor);
    } while (cursor !== 0);

    if (keys.length === 0) return res.status(200).json([]);

    keys.sort((a, b) => {
      const tsA = parseInt(a.split(':')[1], 10) || 0;
      const tsB = parseInt(b.split(':')[1], 10) || 0;
      return tsB - tsA;
    });

    const topKeys = keys.slice(0, 100);
    const entries = await Promise.all(topKeys.map(k => kvGet(k)));
    const result = entries
      .filter(Boolean)
      .map((e, i) => {
        const parsed = typeof e === 'string' ? JSON.parse(e) : e;
        return { key: topKeys[i], ...parsed };
      });
    return res.status(200).json(result);
  }

  // ── Chat list ──
  const keys = [];
  let cursor = 0;
  do {
    const result = await kvScan(cursor, 'chat:*', 100);
    if (!result) break;
    const [nextCursor, batch] = result;
    keys.push(...(batch || []));
    cursor = Number(nextCursor);
  } while (cursor !== 0);

  if (keys.length === 0) return res.status(200).json([]);

  const chats = await Promise.all(keys.map(k => kvGet(k)));
  const summaries = chats
    .filter(Boolean)
    .map(raw => {
      const chat = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return {
        from: chat.from,
        lastMessageAt: chat.lastMessageAt || 0,
        lastMessagePreview: (chat.history || []).slice(-1)[0]?.content?.slice(0, 80) || '',
        score: chat.score || 0,
        aiActive: chat.aiActive !== false,
        takenOverAt: chat.takenOverAt || null,
        notifiedMomAt: chat.notifiedMomAt || null,
        notifiedMom85At: chat.notifiedMom85At || null,
        leadDataSummary: chat.leadData || {},
      };
    })
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt);

  return res.status(200).json(summaries);
});
