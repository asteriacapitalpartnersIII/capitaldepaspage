// ── capitaldepas.com · SEO dinámico ────────────────────────────────────────
//
// Hooks y helpers para actualizar title/description/canonical/OG y JSON-LD
// segun la pagina actual o el proyecto seleccionado.
//
// Uso (desde otros componentes):
//   useSeo({ title, description, canonical, image, jsonLd });
//   useProjectSeo(prop)  // SEO especifico de un RealEstateListing
//
// Tambien dispara capdepasTrack('page_view') al cambiar de "pagina logica".
// ─────────────────────────────────────────────────────────────────────────────────
const BASE_URL = 'https://capitaldepas.com';
const DEFAULT_OG_IMAGE = BASE_URL + '/images/og-cover.jpg';
const DEFAULT_TITLE = 'capitaldepas.com — Departamentos en preventa y venta en México | CDMX, Cancún, Los Cabos';
const DEFAULT_DESC  = 'Departamentos en preventa y venta en CDMX, Cancún, Los Cabos y más. Desarrolladores verificados, hasta 20% por debajo del valor final, asesoría gratuita.';

function setMeta(selector, attr, value) {
  if (!value) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const m = selector.match(/\[(.*?)="(.*?)"\]/);
    if (m) el.setAttribute(m[1], m[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}
function setLink(rel, href, extraAttr) {
  let el = document.head.querySelector('link[rel="' + rel + '"]' + (extraAttr ? '[' + extraAttr.k + '="' + extraAttr.v + '"]' : ''));
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (extraAttr) el.setAttribute(extraAttr.k, extraAttr.v);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}
function setJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function applySeo({ title, description, canonical, image, robots }) {
  if (title) document.title = title;
  if (description) {
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[name="twitter:description"]', 'content', description);
  }
  if (title) {
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[name="twitter:title"]', 'content', title);
  }
  if (image) {
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[name="twitter:image"]', 'content', image);
  }
  if (canonical) {
    setLink('canonical', canonical);
    setMeta('meta[property="og:url"]', 'content', canonical);
  }
  if (robots) {
    setMeta('meta[name="robots"]', 'content', robots);
  }
}

const useSeo = (opts) => {
  React.useEffect(() => {
    applySeo(opts || {});
  }, [opts && opts.title, opts && opts.description, opts && opts.canonical, opts && opts.image]);
};

// SEO especifico de un proyecto (RealEstateListing + BreadcrumbList)
const useProjectSeo = (prop) => {
  React.useEffect(() => {
    if (!prop) {
      setJsonLd('jsonld-project', null);
      setJsonLd('jsonld-breadcrumb', null);
      return;
    }
    const slug = prop.slug || prop.id;
    const url = BASE_URL + '/proyecto/' + encodeURIComponent(slug);
    const image = (prop.photos && prop.photos[0]) ? (prop.photos[0].startsWith('http') ? prop.photos[0] : BASE_URL + prop.photos[0]) : DEFAULT_OG_IMAGE;
    const title = prop.name + ' — ' + (prop.priceStr || '') + ' · ' + (prop.location || '') + ' | capitaldepas.com';
    const description = (prop.desc || ('Departamento en ' + (prop.type || 'preventa') + ' en ' + (prop.location || 'México') + '. ' + (prop.beds || '') + ' rec, ' + (prop.sqm || '') + ' m².')).slice(0, 300);
    applySeo({ title, description, canonical: url, image });

    setJsonLd('jsonld-project', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: prop.name,
      description: prop.desc || description,
      image: image,
      url: url,
      brand: prop.developer ? { '@type': 'Organization', name: prop.developer } : undefined,
      offers: prop.price ? {
        '@type': 'Offer',
        priceCurrency: 'MXN',
        price: prop.price,
        availability: 'https://schema.org/InStock',
        url: url,
      } : undefined,
      additionalProperty: [
        prop.beds ? { '@type': 'PropertyValue', name: 'Recamaras', value: prop.beds } : null,
        prop.baths ? { '@type': 'PropertyValue', name: 'Banos', value: prop.baths } : null,
        prop.sqm ? { '@type': 'PropertyValue', name: 'Metros cuadrados', value: prop.sqm } : null,
        prop.completion ? { '@type': 'PropertyValue', name: 'Entrega', value: prop.completion } : null,
        prop.type ? { '@type': 'PropertyValue', name: 'Estado', value: prop.type } : null,
      ].filter(Boolean),
    });

    setJsonLd('jsonld-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE_URL + '/' },
        { '@type': 'ListItem', position: 2, name: 'Proyectos', item: BASE_URL + '/#proyectos' },
        { '@type': 'ListItem', position: 3, name: prop.name, item: url },
      ]
    });
  }, [prop && (prop.slug || prop.id)]);
};

const resetSeo = () => {
  applySeo({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    canonical: BASE_URL + '/',
    image: DEFAULT_OG_IMAGE,
  });
  setJsonLd('jsonld-project', null);
  setJsonLd('jsonld-breadcrumb', null);
};

// Hook que dispara page_view cuando cambia la pagina logica
const usePageViewTracking = (pageKey, extra) => {
  React.useEffect(() => {
    try {
      if (window.capdepasTrack) {
        window.capdepasTrack('page_view', Object.assign({ page: pageKey }, extra || {}));
      }
    } catch (e) {}
  }, [pageKey]);
};

Object.assign(window, { useSeo, useProjectSeo, applySeo, resetSeo, usePageViewTracking });
