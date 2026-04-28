// ── capitaldepas.com · /api/og/[slug] ─────────────────────────────────────────
//
// Sirve /proyecto/{slug} para crawlers y para humanos.
//
// - Crawlers (facebookexternalhit, Twitterbot, WhatsApp, Slackbot, LinkedInBot,
//   Discordbot, Googlebot, bingbot, Applebot, TelegramBot, Pinterestbot,
//   redditbot): HTML minimo con <title>, meta description, og:*, twitter:*,
//   canonical, y JSON-LD (Product + BreadcrumbList).
//
// - Humanos: el SPA index.html completo, pero con los meta tags por defecto
//   reemplazados por los del proyecto (asi el preview de Twitter/iMessage/
//   Facebook tambien funciona si el usuario comparte la URL despues de cargar
//   el navegador).
//
// Reusa fetchProjects() de api/projects.js (sin segunda llamada al Sheet).
// ─────────────────────────────────────────────────────────────────────────────

const { fetchProjects } = require('../projects.js');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://capitaldepas.com';
const DEFAULT_OG_IMAGE = BASE_URL + '/images/og-cover.jpg';
const SITE_NAME = 'capitaldepas.com';

const CRAWLER_RE = /facebookexternalhit|Twitterbot|WhatsApp|Slackbot|LinkedInBot|Discordbot|Googlebot|bingbot|Applebot|TelegramBot|Pinterestbot|redditbot|Yahoo!\s*Slurp|DuckDuckBot|Baiduspider|YandexBot|ia_archiver|SemrushBot|AhrefsBot/i;

function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
}

function escapeJsonLd(obj) {
    // JSON within <script> must escape "</" so a stray </script> can't terminate the block.
  return JSON.stringify(obj).replace(/<\/(script)/gi, '<\\/$1');
}

function projectMeta(prop) {
    const slug = prop.slug || prop.id;
    const url = BASE_URL + '/proyecto/' + encodeURIComponent(slug);
    const photo = (prop.photos && prop.photos[0]) || '';
    const image = photo
      ? (/^https?:\/\//i.test(photo) ? photo : BASE_URL + (photo.startsWith('/') ? photo : '/' + photo))
          : DEFAULT_OG_IMAGE;
    const priceLabel = prop.priceStr || (prop.price ? '$' + (prop.price / 1e6).toFixed(1) + 'M' : '');
    const title = [prop.name, priceLabel, prop.location]
      .filter(Boolean).join(' · ') + ' | ' + SITE_NAME;
    const fallbackDesc = 'Departamento en ' + (prop.type || 'preventa') +
          ' en ' + (prop.location || 'México') + '. ' +
          (prop.beds ? prop.beds + ' rec, ' : '') +
          (prop.sqm ? prop.sqm + ' m². ' : '') +
          (prop.developer ? 'Desarrollador: ' + prop.developer + '.' : '');
    const description = String(prop.desc || fallbackDesc).slice(0, 300);
    return { slug, url, image, title, description, priceLabel };
}

function productJsonLd(prop, meta) {
    return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: prop.name,
          description: prop.desc || meta.description,
          image: meta.image,
          url: meta.url,
          brand: prop.developer ? { '@type': 'Organization', name: prop.developer } : undefined,
          offers: prop.price
            ? {
                        '@type': 'Offer',
                        priceCurrency: 'MXN',
                        price: prop.price,
                        availability: 'https://schema.org/InStock',
                        url: meta.url,
            }
                  : undefined,
          additionalProperty: [
                  prop.beds ? { '@type': 'PropertyValue', name: 'Recamaras', value: prop.beds } : null,
                  prop.baths ? { '@type': 'PropertyValue', name: 'Banos', value: prop.baths } : null,
                  prop.sqm ? { '@type': 'PropertyValue', name: 'Metros cuadrados', value: prop.sqm } : null,
                  prop.completion ? { '@type': 'PropertyValue', name: 'Entrega', value: prop.completion } : null,
                  prop.type ? { '@type': 'PropertyValue', name: 'Estado', value: prop.type } : null,
                ].filter(Boolean),
    };
}

function breadcrumbJsonLd(prop, meta) {
    return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE_URL + '/' },
            { '@type': 'ListItem', position: 2, name: 'Proyectos', item: BASE_URL + '/proyectos' },
            { '@type': 'ListItem', position: 3, name: prop.name, item: meta.url },
                ],
    };
}

function renderCrawlerHtml(prop) {
    const m = projectMeta(prop);
    const product = productJsonLd(prop, m);
    const crumbs = breadcrumbJsonLd(prop, m);
    return `<!DOCTYPE html>
    <html lang="es-MX">
    <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(m.title)}</title>
    <meta name="description" content="${escapeHtml(m.description)}" />
    <link rel="canonical" href="${escapeHtml(m.url)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:locale" content="es_MX" />
    <meta property="og:title" content="${escapeHtml(m.title)}" />
    <meta property="og:description" content="${escapeHtml(m.description)}" />
    <meta property="og:url" content="${escapeHtml(m.url)}" />
    <meta property="og:image" content="${escapeHtml(m.image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(prop.name)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(m.title)}" />
    <meta name="twitter:description" content="${escapeHtml(m.description)}" />
    <meta name="twitter:image" content="${escapeHtml(m.image)}" />
    <script type="application/ld+json">${escapeJsonLd(product)}</script>
    <script type="application/ld+json">${escapeJsonLd(crumbs)}</script>
    </head>
    <body>
    <main>
    <h1>${escapeHtml(prop.name)}</h1>
    <p>${escapeHtml(m.description)}</p>
    <ul>
    ${prop.priceStr ? `<li><strong>Precio:</strong> ${escapeHtml(prop.priceStr)}</li>` : ''}
    ${prop.location ? `<li><strong>Ubicación:</strong> ${escapeHtml(prop.location)}</li>` : ''}
    ${prop.beds ? `<li><strong>Recámaras:</strong> ${escapeHtml(prop.beds)}</li>` : ''}
    ${prop.baths ? `<li><strong>Baños:</strong> ${escapeHtml(prop.baths)}</li>` : ''}
    ${prop.sqm ? `<li><strong>Superficie:</strong> ${escapeHtml(prop.sqm)} m²</li>` : ''}
    ${prop.completion ? `<li><strong>Entrega:</strong> ${escapeHtml(prop.completion)}</li>` : ''}
    ${prop.developer ? `<li><strong>Desarrollador:</strong> ${escapeHtml(prop.developer)}</li>` : ''}
    ${prop.type ? `<li><strong>Estado:</strong> ${escapeHtml(prop.type)}</li>` : ''}
    </ul>
    ${prop.amenities && prop.amenities.length ? `<h2>Amenidades</h2><ul>${prop.amenities.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul>` : ''}
    <p><a href="${escapeHtml(m.url)}">Ver el proyecto en ${escapeHtml(SITE_NAME)}</a></p>
    </main>
    </body>
    </html>`;
}

// Lee index.html del filesystem (deploy bundle de Vercel).
let _indexHtmlCache = null;
function readIndexHtml() {
    if (_indexHtmlCache) return _indexHtmlCache;
    // Vercel deploys preservan layout del repo; index.html esta en root del proyecto.
  const candidates = [
        path.join(process.cwd(), 'index.html'),
        path.join(__dirname, '..', '..', 'index.html'),
      ];
    for (const p of candidates) {
          try {
                  const txt = fs.readFileSync(p, 'utf8');
                  _indexHtmlCache = txt;
                  return txt;
          } catch (e) { /* try next */ }
    }
    return null;
}

function injectMetaIntoHtml(html, prop) {
    const m = projectMeta(prop);
    const product = productJsonLd(prop, m);
    const crumbs = breadcrumbJsonLd(prop, m);

  // 1) Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i,
                          `<title>${escapeHtml(m.title)}</title>`);

  // 2) name="description"
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i,
                          `<meta name="description" content="${escapeHtml(m.description)}" />`);

  // 3) canonical
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i,
                          `<link rel="canonical" href="${escapeHtml(m.url)}" />`);

  // 4) og:* y twitter:*
  const replaceMeta = (attrName, attrVal, contentVal) => {
        const re = new RegExp('<meta\\s+' + attrName + '=["\']' + attrVal + '["\'][^>]*>', 'i');
        html = html.replace(re,
                                  `<meta ${attrName}="${attrVal}" content="${escapeHtml(contentVal)}" />`);
  };
    replaceMeta('property', 'og:title', m.title);
    replaceMeta('property', 'og:description', m.description);
    replaceMeta('property', 'og:url', m.url);
    replaceMeta('property', 'og:image', m.image);
    replaceMeta('property', 'og:image:alt', prop.name);
    replaceMeta('property', 'og:type', 'product');
    replaceMeta('name', 'twitter:title', m.title);
    replaceMeta('name', 'twitter:description', m.description);
    replaceMeta('name', 'twitter:image', m.image);

  // 5) Inyecta JSON-LD del proyecto justo antes de </head>
  const extraLd =
        `<script type="application/ld+json" id="jsonld-project-ssr">${escapeJsonLd(product)}</script>` +
        `<script type="application/ld+json" id="jsonld-breadcrumb-ssr">${escapeJsonLd(crumbs)}</script>`;
    html = html.replace(/<\/head>/i, extraLd + '</head>');

  return html;
}

function renderHumanFallback(prop) {
    // Fallback minimo si no podemos leer index.html (no deberia pasar en Vercel).
  // Sirve el SPA shell con scripts necesarios. Match el patron del index.html real.
  const m = projectMeta(prop);
    const product = productJsonLd(prop, m);
    const crumbs = breadcrumbJsonLd(prop, m);
    return `<!DOCTYPE html>
    <html lang="es-MX">
    <head>
    <meta charset="UTF-8" />
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(m.title)}</title>
    <meta name="description" content="${escapeHtml(m.description)}" />
    <link rel="canonical" href="${escapeHtml(m.url)}" />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:locale" content="es_MX" />
    <meta property="og:title" content="${escapeHtml(m.title)}" />
    <meta property="og:description" content="${escapeHtml(m.description)}" />
    <meta property="og:url" content="${escapeHtml(m.url)}" />
    <meta property="og:image" content="${escapeHtml(m.image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(m.title)}" />
    <meta name="twitter:description" content="${escapeHtml(m.description)}" />
    <meta name="twitter:image" content="${escapeHtml(m.image)}" />
    <script type="application/ld+json">${escapeJsonLd(product)}</script>
    <script type="application/ld+json">${escapeJsonLd(crumbs)}</script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css" rel="stylesheet" />
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js"></script>
    <style>body{background:#F5F3EE;color:#0E0E0C;font-family:'DM Sans',system-ui,sans-serif;margin:0}</style>
    </head>
    <body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
    <script type="text/babel" src="js/data.jsx"></script>
    <script type="text/babel" src="js/seo.jsx"></script>
    <script type="text/babel" src="js/cursor.jsx"></script>
    <script type="text/babel" src="js/nav.jsx"></script>
    <script type="text/babel" src="js/hero.jsx"></script>
    <script type="text/babel" src="js/listings.jsx"></script>
    <script type="text/babel" src="js/project-detail.jsx"></script>
    <script type="text/babel" src="js/sections.jsx"></script>
    <script type="text/babel" src="js/calculator.jsx"></script>
    <script type="text/babel" src="js/map-section.jsx"></script>
    <script type="text/babel" src="js/blog.jsx"></script>
    <script type="text/babel" src="js/contact.jsx"></script>
    <script type="text/babel" src="js/footer.jsx"></script>
    <script type="text/babel" src="js/app.jsx"></script>
    </body>
    </html>`;
}

function notFoundHtml(slug, isCrawler) {
    const url = BASE_URL + '/proyecto/' + encodeURIComponent(slug);
    const title = 'Proyecto no encontrado | ' + SITE_NAME;
    const desc = 'El proyecto que buscas no existe o fue removido. Explora todos los desarrollos disponibles en ' + SITE_NAME + '.';
    if (isCrawler) {
          return `<!DOCTYPE html>
          <html lang="es-MX">
          <head>
          <meta charset="UTF-8" />
          <title>${escapeHtml(title)}</title>
          <meta name="description" content="${escapeHtml(desc)}" />
          <meta name="robots" content="noindex, follow" />
          <link rel="canonical" href="${BASE_URL}/proyectos" />
          <meta property="og:title" content="${escapeHtml(title)}" />
          <meta property="og:description" content="${escapeHtml(desc)}" />
          <meta property="og:url" content="${escapeHtml(url)}" />
          <meta property="og:image" content="${DEFAULT_OG_IMAGE}" />
          <meta name="twitter:card" content="summary_large_image" />
          </head>
          <body>
          <main><h1>Proyecto no encontrado</h1><p>${escapeHtml(desc)}</p>
          <p><a href="${BASE_URL}/proyectos">Ver todos los proyectos</a></p></main>
          </body>
          </html>`;
    }
    // Humanos: deja que el SPA muestre el listado / vista de no encontrado.
  const html = readIndexHtml();
    if (!html) {
          return `<!DOCTYPE html><html lang="es-MX"><head><meta charset="UTF-8"/><meta name="robots" content="noindex"/><title>${escapeHtml(title)}</title></head><body><script>window.location.href='/proyectos'</script></body></html>`;
    }
    // Marca noindex y deja que el cliente resuelva.
  return html.replace(/<meta\s+name=["']robots["'][^>]*>/i,
                          '<meta name="robots" content="noindex, follow" />');
}

async function handler(req, res) {
    try {
          // Vercel pasa el slug en req.query.slug. Tambien aceptamos extraerlo del URL.
      let slug = (req.query && (req.query.slug || req.query['slug'])) || '';
          if (!slug && req.url) {
                  const m = req.url.match(/\/proyecto\/([^/?#]+)/);
                  if (m) slug = decodeURIComponent(m[1]);
          }
          slug = String(slug || '').toLowerCase().trim();

      const ua = String((req.headers && (req.headers['user-agent'] || req.headers['User-Agent'])) || '');
          const isCrawler = CRAWLER_RE.test(ua);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
          // Cache moderado: humanos o bots. Permite revalidacion rapida si actualizas el Sheet.
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

      if (!slug) {
              res.status(404).send(notFoundHtml('', isCrawler));
              return;
      }

      const data = await fetchProjects();
          const properties = (data && data.properties) || [];
          const prop = properties.find(p => String(p.slug || p.id || '').toLowerCase() === slug);

      if (!prop) {
              res.status(404).send(notFoundHtml(slug, isCrawler));
              return;
      }

      if (isCrawler) {
              res.status(200).send(renderCrawlerHtml(prop));
              return;
      }

      // Humanos: SPA shell con meta inyectado.
      const indexHtml = readIndexHtml();
          if (indexHtml) {
                  res.status(200).send(injectMetaIntoHtml(indexHtml, prop));
                  return;
          }
          // Fallback (no deberia pasar): SPA shell minimo construido inline.
      res.status(200).send(renderHumanFallback(prop));
    } catch (err) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.status(500).send(
                  '<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="robots" content="noindex"/><title>Error</title></head><body><h1>Error</h1><pre>' +
                  escapeHtml(String(err && err.stack || err)) +
                  '</pre></body></html>'
                );
    }
}

module.exports = handler;
