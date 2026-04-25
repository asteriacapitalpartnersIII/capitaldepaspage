// Devuelve config publica al cliente (token de Mapbox publico, etc.)
// El token vive en una variable de entorno de Vercel: MAPBOX_TOKEN

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    mapboxToken: process.env.MAPBOX_TOKEN || '',
  });
};
