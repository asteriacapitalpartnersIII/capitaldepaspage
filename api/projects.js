// ── capitaldepas.com · API /api/projects ────────────────────
//
// Lee la hoja de Google (dos pestanas: "proyectos" y "blog") y la convierte
// a JSON. El sitio llama a este endpoint al cargar.
//
// Tambien exporta fetchProjects() para que /api/sitemap.xml y /api/seo lo usen.
// ─────────────────────────────────────────────────────────────────────────────────
const SHEET_ID = '1Ynfoj4WLF2yaCfe5QN3ToywfsDNwVq2U2LvDqz4smX4';
const urlFor = (sheetName) => 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(sheetName);

function parseCSV(text)  {
  const rows = []; let row = [], cell = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else cell += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (ch === '\r') { /* ignore */ }
      else cell += ch;
    }
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function normalizeRows(rows) {
  if (rows.length < 2) return rows;
  const SPLIT_RE = /\t+| {2,}/;
  const looksBlobbed = (row) => {
    if (!row || !row[0] || typeof row[0] !== 'string') return false;
    if (!SPLIT_RE.test(row[0])) return false;
    const restNonEmpty = row.slice(1).some(c => c && String(c).trim().length > 0);
    return !restNonEmpty;
  };
  const dataRows = rows.slice(1);
  const hasBlobbedData = dataRows.some(looksBlobbed);
  const headerBlobbed = looksBlobbed(rows[0]);
  if (!hasBlobbedData && !headerBlobbed) return rows;
  return rows.map(row => {
    if (looksBlobbed(row)) return row[0].split(SPLIT_RE).map(c => c.trim());
    return row;
  });
}

const toNumber = (s) => { const n = parseFloat(String(s == null ? '' : s).replace(/[^\d.\-]/g, '')); return Number.isFinite(n) ? n : 0; };
const toFloat = (s) => { const n = parseFloat(String(s == null ? '' : s).trim()); return Number.isFinite(n) ? n : null; };
const toList = (s) => String(s == null ? '' : s).split(',').map(x => x.trim()).filter(Boolean);
const yesish = (s) => /^(s[ií]|yes|true|1|x)$/i.test(String(s == null ? '' : s).trim());
const resolvePhoto = (p) => {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith('/')) return p;
  return '/images/projects/' + p;
};

function rowToProject(headers, row) {
  const get = (name) => { const idx = headers.findIndex(h => h.toLowerCase() === name.toLowerCase()); return idx >= 0 ? (row[idx] || '').trim() : ''; };
  const slug = get('slug'); if (!slug) return null;
  const price = toNumber(get('precio'));
  const priceStr = get('precio_texto') || (price ? '$' + (price/1e6).toFixed(1) + 'M' : '');
  const lat = toFloat(get('lat'));
  const lng = toFloat(get('lng'));
  return {
    id: slug, slug, name: get('nombre'),
    location: get('ubicacion'), zone: get('zona').toLowerCase(),
    price, priceStr,
    beds: toNumber(get('recamaras')) || 1,
    baths: toNumber(get('banos')) || 1,
    sqm: toNumber(get('m2')),
    type: (get('estado') || 'preventa').toLowerCase(),
    completion: get('entrega'),
    developer: get('desarrollador'),
    amenities: toList(get('amenidades')),
    desc: get('descripcion'),
    photos: toList(get('fotos')).map(resolvePhoto).filter(Boolean),
  brochure: get('brochure') || null,
    accentHue: toNumber(get('hue')) || 220,
    featured: yesish(get('destacado')),
    lat, lng, hasCoords: lat !== null && lng !== null,
  };
}

function rowToPost(headers, row) {
  const get = (name) => { const idx = headers.findIndex(h => h.toLowerCase() === name.toLowerCase()); return idx >= 0 ? (row[idx] || '').trim() : ''; };
  const slug = get('slug'); if (!slug) return null;
  return {
    id: slug, slug, title: get('titulo'),
    cat: get('categoria'), date: get('fecha'),
    read: get('lectura') || '3 min',
    excerpt: get('resumen'), body: get('cuerpo'),
    accentHue: toNumber(get('hue')) || 220,
    photo: resolvePhoto(get('portada')),
  };
}

async function fetchSheet(sheetName) {
  try {
    const r = await fetch(urlFor(sheetName));
    if (!r.ok) return null;
    const text = await r.text();
    const rawRows = parseCSV(text);
    const rows = normalizeRows(rawRows);
    if (rows.length < 2) return null;
    const headers = rows[0].map(h => (h || '').trim());
    return { headers, rows: rows.slice(1) };
  } catch { return null; }
}

const ZONE_TO_CITY = {
  'cdmx':'CDMX','polanco':'CDMX','reforma':'CDMX','reforma centro':'CDMX',
  'condesa':'CDMX','roma':'CDMX',
  'cancun':'Cancún','cancún':'Cancún','zona hotelera':'Cancún',
  'los cabos':'Los Cabos','los-cabos':'Los Cabos',
  'cabo san lucas':'Los Cabos','san jose del cabo':'Los Cabos',
  'oaxaca':'Oaxaca',
};
function zoneToCity(zone) {
  const z = String(zone || '').toLowerCase().trim();
  if (!z) return '';
  if (ZONE_TO_CITY[z]) return ZONE_TO_CITY[z];
  return z.charAt(0).toUpperCase() + z.slice(1);
}
function buildStats(properties) {
  const developers = new Set();
  const cities = new Set();
  for (const p of properties) {
    if (p.developer) developers.add(p.developer.trim().toLowerCase());
    const city = zoneToCity(p.zone);
    if (city) cities.add(city);
  }
  return { projects: properties.length, developers: developers.size, cities: cities.size };
}

// Funcion exportada para sitemap, seo, etc.
async function fetchProjects() {
  const [proyectos, blog] = await Promise.all([
    fetchSheet('proyectos'),
    fetchSheet('blog'),
  ]);
  const properties = proyectos && proyectos.rows
    ? proyectos.rows.map((r) => rowToProject(proyectos.headers, r)).filter(Boolean)
    : [];
  const posts = blog && blog.rows
    ? blog.rows.map((r) => rowToPost(blog.headers, r)).filter(Boolean)
    : [];
  const stats = buildStats(properties);
  return { properties, posts, stats, count: properties.length };
}

async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const out = await fetchProjects();
    res.status(200).json(out);
  } catch (err) {
    res.status(500).json({ error: String(err), properties: [], posts: [], stats: { projects: 0, developers: 0, cities: 0 } });
  }
}

module.exports = handler;
module.exports.fetchProjects = fetchProjects;
module.exports.zoneToCity = zoneToCity;
