// ── capitaldepas.com · API /api/projects ─────────────────────────────────────
//
// Lee la hoja de Google (dos pestañas: "proyectos" y "blog") y la convierte
// a JSON. El sitio llama a este endpoint al cargar.
//
// La hoja debe estar compartida como "Cualquier persona con el enlace — lector".
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_ID = '1Ynfoj4WLF2yaCfe5QN3ToywfsDNwVq2U2LvDqz4smX4';

const urlFor = (sheetName) =>
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

// ── CSV parser (maneja comillas, saltos de línea dentro de celdas, etc.) ─────
function parseCSV(text) {
      const rows = [];
      let row = [], cell = '', inQuotes = false;
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
      return rows.filter(r => r.some(c => c && c.trim()));
}

// ── Normaliza las filas: si alguna celda tiene tabs embebidos, expande esa
//    celda a múltiples columnas (caso: sheet tiene todo en columna A como TSV)
function normalizeRows(rows) {
      if (rows.length < 2) return rows;

  // Detectar si filas de datos tienen tabs en la primera celda
  // (el header puede estar bien pero los datos pegados en col A como TSV)
  const dataRows = rows.slice(1);
      const hasTabbedData = dataRows.some(r => r[0] && r[0].includes('\t'));
      const headerHasTabs = rows[0][0] && rows[0][0].includes('\t');

  if (!hasTabbedData && !headerHasTabs) return rows;

  // Expandir cada fila cuya celda 0 contenga tabs
  return rows.map(row => {
          if (row[0] && row[0].includes('\t')) {
                    return row[0].split('\t').map(c => c.trim());
          }
          return row;
  });
}

const toNumber = (s) => {
      const n = parseFloat(String(s ?? '').replace(/[^0-9.\-]/g, ''));
      return Number.isFinite(n) ? n : 0;
};
const toList = (s) => String(s ?? '').split(',').map(x => x.trim()).filter(Boolean);
const yesish = (s) => /^(si|sí|yes|true|1|x)$/i.test(String(s ?? '').trim());

// Resuelve rutas de fotos. Si el valor ya es una URL completa, se deja.
// Si es un nombre de archivo, se prefija con /images/projects/.
const resolvePhoto = (p) => {
      if (!p) return null;
      if (/^https?:\/\//i.test(p)) return p;
      if (p.startsWith('/')) return p;
      return `/images/projects/${p}`;
};

// ── Mapeo de fila → proyecto ───────────────────────────────────────────────────
function rowToProject(headers, row, i) {
      const get = (name) => {
              const idx = headers.indexOf(name);
              return idx >= 0 ? (row[idx] ?? '').trim() : '';
      };
      const slug = get('slug');
      if (!slug) return null;
      const price = toNumber(get('precio'));
      const rawPriceStr = get('precio_texto');
      const priceStr = rawPriceStr || (price ? `$${(price / 1_000_000).toFixed(1)}M` : '');
      return {
              id: slug,
              slug,
              name: get('nombre'),
              location: get('ubicacion'),
              zone: get('zona').toLowerCase(),
              price,
              priceStr,
              beds: toNumber(get('recamaras')) || 1,
              baths: toNumber(get('banos')) || 1,
              sqm: toNumber(get('m2')),
              type: (get('estado') || 'preventa').toLowerCase(),
              completion: get('entrega'),
              developer: get('desarrollador'),
              amenities: toList(get('amenidades')),
              desc: get('descripcion'),
              photos: toList(get('fotos')).map(resolvePhoto).filter(Boolean),
              accentHue: toNumber(get('hue')) || 220,
              featured: yesish(get('destacado')),
      };
}

function rowToPost(headers, row, i) {
      const get = (name) => {
              const idx = headers.indexOf(name);
              return idx >= 0 ? (row[idx] ?? '').trim() : '';
      };
      const slug = get('slug');
      if (!slug) return null;
      return {
              id: slug,
              slug,
              title: get('titulo'),
              cat: get('categoria'),
              date: get('fecha'),
              read: get('lectura') || '3 min',
              excerpt: get('resumen'),
              body: get('cuerpo'),
              accentHue: toNumber(get('hue')) || 220,
              photo: resolvePhoto(get('portada')),
      };
}

async function fetchSheet(sheetName) {
      try {
              const r = await fetch(urlFor(sheetName));
              if (!r.ok) return [];
              const text = await r.text();
              const rawRows = parseCSV(text);
              const rows = normalizeRows(rawRows);
              if (rows.length < 2) return [];
              const headers = rows[0].map(h => h.trim().toLowerCase());
              return { headers, rows: rows.slice(1) };
      } catch {
              return [];
      }
}

module.exports = async (req, res) => {
      // Cache de 5 minutos en el edge; CDN revalida en background
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      try {
              const [proyectos, blog] = await Promise.all([
                        fetchSheet('proyectos'),
                        fetchSheet('blog'),
                      ]);
              const properties = proyectos && proyectos.rows
                ? proyectos.rows.map((r, i) => rowToProject(proyectos.headers, r, i)).filter(Boolean)
                        : [];
              const posts = blog && blog.rows
                ? blog.rows.map((r, i) => rowToPost(blog.headers, r, i)).filter(Boolean)
                        : [];
              res.status(200).json({ properties, posts, count: properties.length });
      } catch (err) {
              res.status(500).json({ error: String(err), properties: [], posts: [] });
      }
};
