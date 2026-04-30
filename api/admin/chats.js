// api/admin/chats.js
// GET /api/admin/chats             — list of all chats
// GET /api/admin/chats?log=1       — login activity log (last 100 entries)
const { withAuth } = require('../_lib/auth');
const { kv } = require('@vercel/kv');

module.exports = withAuth(async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

                            // ── Login activity log ──────────────────────────────────────────────────
                            if (req.query && req.query.log === '1') {
                                  let cursor = 0;
                                  const keys = [];
                                  do {
                                          const [nextCursor, batch] = await kv.scan(cursor, { match: 'loginlog:*', count: 200 });
                                          keys.push(...batch);
                                          cursor = nextCursor;
                                  } while (cursor !== 0);

      if (keys.length === 0) return res.status(200).json([]);

      keys.sort((a, b) => {
              const tsA = parseInt(a.split(':')[1], 10) || 0;
              const tsB = parseInt(b.split(':')[1], 10) || 0;
              return tsB - tsA;
      });

      const topKeys = keys.slice(0, 100);
                                  const entries = await Promise.all(topKeys.map(k => kv.get(k)));
                                  const result = entries.filter(Boolean).map((e, i) => ({ key: topKeys[i], ...e }));
                                  return res.status(200).json(result);
                            }

                            // ── Chat list ───────────────────────────────────────────────────────────
                            let cursor = 0;
    const keys = [];
    do {
          const [nextCursor, batch] = await kv.scan(cursor, { match: 'chat:*', count: 100 });
          keys.push(...batch);
          cursor = nextCursor;
    } while (cursor !== 0);

                            if (keys.length === 0) return res.status(200).json([]);

                            const chats = await Promise.all(keys.map(k => kv.get(k)));

                            const summaries = chats
      .filter(Boolean)
      .map(chat => ({
              from: chat.from,
              lastMessageAt: chat.lastMessageAt || 0,
              lastMessagePreview: (chat.history || []).slice(-1)[0]?.content?.slice(0, 80) || '',
              score: chat.score || 0,
              aiActive: chat.aiActive !== false,
              takenOverAt: chat.takenOverAt || null,
              notifiedMomAt: chat.notifiedMomAt || null,
              notifiedMom85At: chat.notifiedMom85At || null,
              leadDataSummary: chat.leadData || {},
      }))
      .sort((a, b) => b.lastMessageAt - a.lastMessageAt);

                            return res.status(200).json(summaries);
});
