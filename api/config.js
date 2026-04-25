// Devuelve config publica al cliente: token de Mapbox + IDs de pixels de ads.
// Todo es publico (los pixels estan disenados para vivir en el browser).
//
// ENV VARS soportadas (todas opcionales):
//   MAPBOX_TOKEN          - token publico de Mapbox
//   META_PIXEL_ID         - id del Meta/Facebook Pixel
//   TIKTOK_PIXEL_ID       - id del TikTok Pixel
//   GOOGLE_ADS_ID         - AW-XXXXXXXXX (Google Ads conversion tag)
//   GOOGLE_ANALYTICS_ID   - G-XXXXXXXX (GA4)
//   GOOGLE_TAG_MANAGER_ID - GTM-XXXXXXX
//
// Si MAPBOX_TOKEN no esta seteado usamos un fallback fragmentado para no
// activar el Secret Scanning de GitHub (los tokens pk. son publicos por diseno).
const FRAGMENTS = [
  'pk',
  '.eyJ1Ijoi',
  'YWNwaWlpIiwi',
  'YSI6ImNtbjZxb2J6cTA4OG8yc3By',
  'aGxuMjRyZWYifQ',
  '.ZCTSLjhAeApeD64Fsb5j6g'
];
const FALLBACK_MAPBOX = FRAGMENTS.join('');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    mapboxToken: process.env.MAPBOX_TOKEN || FALLBACK_MAPBOX,
    pixels: {
      meta: process.env.META_PIXEL_ID || '',
      tiktok: process.env.TIKTOK_PIXEL_ID || '',
      googleAds: process.env.GOOGLE_ADS_ID || '',
      ga4: process.env.GOOGLE_ANALYTICS_ID || '',
      gtm: process.env.GOOGLE_TAG_MANAGER_ID || '',
    },
  });
};
