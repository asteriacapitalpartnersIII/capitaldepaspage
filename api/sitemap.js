// /api/sitemap.xml dinamico construido a partir de la hoja de Google Sheets.
// Incluye home + secciones + un <url> por cada proyecto.
const { fetchProjects } = require('./projects');

const BASE_URL = 'https://capitaldepas.com';

function xmlEscape(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    '    <loc>' + xmlEscape(loc) + '</loc>',
    lastmod ? '    <lastmod>' + xmlEscape(lastmod) + '</lastmod>' : '',
    changefreq ? '    <changefreq>' + xmlEscape(changefreq) + '</changefreq>' : '',
    priority ? '    <priority>' + xmlEscape(priority) + '</priority>' : '',
    '  </url>'
  ].filter(Boolean).join('\n');
}

module.exports = async (req, res) => {
  let properties = [];
  try {
    const data = await (typeof fetchProjects === 'function' ? fetchProjects() : null);
    properties = (data && data.properties) || [];
  } catch (e) {
    properties = [];
  }

  const today = new Date().toISOString().slice(0,10);
  const staticUrls = [
    { loc: BASE_URL + '/', changefreq: 'daily', priority: '1.0', lastmod: today },
    { loc: BASE_URL + '/#proyectos', changefreq: 'daily', priority: '0.9', lastmod: today },
    { loc: BASE_URL + '/#mapa', changefreq: 'weekly', priority: '0.7', lastmod: today },
    { loc: BASE_URL + '/#blog', changefreq: 'weekly', priority: '0.6', lastmod: today },
    { loc: BASE_URL + '/#contacto', changefreq: 'monthly', priority: '0.6', lastmod: today },
  ];

  const projectUrls = properties.map(p => ({
    loc: BASE_URL + '/proyecto/' + encodeURIComponent(p.slug || p.id || ''),
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: today,
  }));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls.map(urlEntry),
    ...projectUrls.map(urlEntry),
    '</urlset>'
  ].join('\n');

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
};
