// Devuelve config publica al cliente.
//
// Solo expone los campos listados en PUBLIC_KEYS. Si quieres exponer algo
// nuevo al browser, agrega su llave aqui y NADA mas — esto es la unica via
// por la que process.env llega al cliente. No agregues secretos.
//
// ENV VARS soportadas (todas opcionales):
//   MAPBOX_TOKEN             - token publico (pk.*) de Mapbox
//   WHATSAPP_DISPLAY_NUMBER  - numero E.164 sin prefijo "whatsapp:" (ej: 14155238886)
//                              que se usa en wa.me links del sitio publico.
//                              Si esta vacio el boton de WhatsApp NO se renderiza.
//   META_PIXEL_ID            - Meta/Facebook Pixel
//   TIKTOK_PIXEL_ID          - TikTok Pixel
//   GOOGLE_ADS_ID            - AW-XXXXXXXXX
//   GOOGLE_ANALYTICS_ID      - G-XXXXXXXX (GA4)
//   GOOGLE_TAG_MANAGER_ID    - GTM-XXXXXXX
//
// Si MAPBOX_TOKEN no esta seteado devolvemos mapboxToken: null y el cliente
// muestra un placeholder. NO hay fallback a un token hardcoded — un token
// silenciosamente caducado es peor que ningun mapa.

const PUBLIC_KEYS = [
    'mapboxToken',
    'whatsappDisplayNumber',
    'pixels',
  ];

function buildPayload() {
    const waNumber = (process.env.WHATSAPP_DISPLAY_NUMBER || '').trim();
    return {
          mapboxToken: process.env.MAPBOX_TOKEN || null,
          whatsappDisplayNumber: waNumber || null,
          pixels: {
                  meta:      process.env.META_PIXEL_ID       || '',
                  tiktok:    process.env.TIKTOK_PIXEL_ID     || '',
                  googleAds: process.env.GOOGLE_ADS_ID       || '',
                  ga4:       process.env.GOOGLE_ANALYTICS_ID || '',
                  gtm:       process.env.GOOGLE_TAG_MANAGER_ID || '',
          },
    };
}

module.exports = (req, res) => {
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Allowlist enforcement: drop any keys not in PUBLIC_KEYS before responding.
    const full = buildPayload();
    const safe = {};
    for (const k of PUBLIC_KEYS) safe[k] = full[k];

    res.status(200).json(safe);
};
