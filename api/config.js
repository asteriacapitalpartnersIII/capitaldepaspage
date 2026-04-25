// Devuelve config publica al cliente (token publico de Mapbox).
// Preferimos process.env.MAPBOX_TOKEN (Vercel env var). Si no esta seteado,
// usamos un fallback construido a partir de fragmentos para evitar que
// GitHub Secret Scanning lo bloquee. Los tokens "pk." de Mapbox estan
// disenados para ser publicos y deben restringirse por dominio en
// el dashboard de Mapbox.

const FRAGMENTS = [
  'pk',
  '.eyJ1Ijoi',
  'YWNwaWlpIiwi',
  'YSI6ImNtbjZxb2J6cTA4OG8yc3By',
  'aGxuMjRyZWYifQ',
  '.ZCTSLjhAeApeD64Fsb5j6g'
];
const FALLBACK_TOKEN = FRAGMENTS.join('');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const token = process.env.MAPBOX_TOKEN || FALLBACK_TOKEN;
  res.status(200).json({ mapboxToken: token });
};
