// api/admin/chats.js — GET list of all chats
const { withAuth } = require('../_lib/auth');
const { kv } = require('@vercel/kv');

module.exports = withAuth(async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  // SCAN all chat:* keys with pagination
  let cursor = 0;
  const keys = [];
  do {
    const [nextCursor, batch] = await kv.scan(cursor, { match: 'chat:*', count: 100 });
    keys.push(...batch);
    cursor = nextCursor;
  } while (cursor !== 0);

  if (keys.length === 0) return res.status(200).json([]);

  // Fetch all chats in parallel
  const chats = await Promise.all(keys.map(k => kv.get(k)));

  // Build summary array
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
