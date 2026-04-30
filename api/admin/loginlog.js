// api/admin/loginlog.js — GET last 100 login attempts (auth-required)
// Exposes login activity to admins for auditing. Returns newest first.
const { withAuth } = require('../_lib/auth');
const { kv } = require('@vercel/kv');

module.exports = withAuth(async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

                            // Scan for loginlog:* keys (format: loginlog:{timestamp}:{ip_hash})
                            let cursor = 0;
    const keys = [];
    do {
          const [nextCursor, batch] = await kv.scan(cursor, { match: 'loginlog:*', count: 200 });
          keys.push(...batch);
          cursor = nextCursor;
    } while (cursor !== 0);

                            if (keys.length === 0) return res.status(200).json([]);

                            // Sort by timestamp embedded in key (loginlog:{ts}:{hash}), newest first
                            keys.sort((a, b) => {
                                  const tsA = parseInt(a.split(':')[1], 10) || 0;
                                  const tsB = parseInt(b.split(':')[1], 10) || 0;
                                  return tsB - tsA;
                            });

                            const topKeys = keys.slice(0, 100);
    const entries = await Promise.all(topKeys.map(k => kv.get(k)));

                            const result = entries
      .filter(Boolean)
      .map((e, i) => ({ key: topKeys[i], ...e }));

                            return res.status(200).json(result);
});
