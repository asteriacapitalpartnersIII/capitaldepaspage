// ── capitaldepas.com · Data & Shared Hooks ──────────────────────────────────────
//
// Los datos de proyectos vienen de Google Sheets (vía /api/projects).
// Mientras cargan, mostramos los placeholders definidos abajo.
// Si la API falla o no hay filas en la hoja, el sitio sigue funcionando
// con los placeholders sin romperse.
// ─────────────────────────────────────────────────────────────────────────────
let PROPERTIES = [
  {
        id:"torre-polanco", slug:"torre-polanco", name:"Torre Polanco",
        location:"Polanco, CDMX", zone:"cdmx",
        price:3200000, priceStr:"$3.2M", beds:2, baths:2, sqm:85,
        type:"preventa", completion:"Q4 2026", developer:"Capital Dev",
        amenities:["Alberca","Gimnasio","Roof garden","Lobby 24h"],
        desc:"Departamentos de alto diseño en el corazón de Polanco. Acabados de primera, vistas panorámicas y ubicación privilegiada.",
        accentHue:220, photos:["/images/projects/torre-polanco-01.jpg"], featured:true
  },
  {
        id:"laguna-cancun", slug:"laguna-cancun", name:"Laguna Cancún",
        location:"Zona Hotelera, Cancún", zone:"cancun",
        price:5200000, priceStr:"$5.2M", beds:2, baths:2, sqm:95,
        type:"preventa", completion:"Q3 2027", developer:"Capital Dev",
        amenities:["Vista al mar","Marina privada","Alberca infinita","Concierge"],
        desc:"Frente al Mar Caribe, con marina privada y amenidades de resort 5 estrellas.",
        accentHue:185, photos:["/images/projects/laguna-cancun-01.jpg"], featured:true
  },
  ];

let BLOG_POSTS = [
  {
        id:1, slug:"guia-preventa-2026",
        title:"Guía para comprar en preventa en 2026",
        cat:"Guía", date:"18 Abr 2026", read:"6 min",
        excerpt:"Todo lo que necesitas saber antes de firmar un contrato de preventa: beneficios, riesgos y cómo proteger tu inversión.",
        accentHue:45, body:""
  },
  {
        id:2, slug:"mejores-desarrollos-playa",
        title:"Los mejores desarrollos cerca de la playa en México",
        cat:"Tendencias", date:"10 Abr 2026", read:"4 min",
        excerpt:"Cancún, Los Cabos, Puerto Escondido: analizamos los proyectos con mayor potencial de plusvalía en 2026.",
        accentHue:185, body:""
  },
  ];

const TESTIMONIALS = [
  { id:1, name:"Sofía Ramírez", role:"Compradora, Polanco", text:"capitaldepas.com me hizo el proceso increíblemente sencillo. Encontré mi depa en Polanco en menos de una semana y el asesor estuvo disponible en todo momento.", stars:5, initials:"SR" },
  { id:2, name:"Carlos Mendoza", role:"Inversor, Cancún", text:"Tengo 3 departamentos en preventa gracias a capitaldepas. La plataforma es transparente, los desarrolladores son serios y el ROI ha sido excelente.", stars:5, initials:"CM" },
  { id:3, name:"Ana González", role:"Primera compradora, Roma", text:"Como compradora primeriza estaba muy nerviosa, pero el equipo me guió paso a paso. La calculadora de crédito fue súper útil para entender mis opciones.", stars:5, initials:"AG" },
  ];

const FAQS = [
  { q:"¿Qué es una preventa?", a:"Una preventa es la venta de un inmueble antes de que sea construido o terminado. Esto te permite adquirirlo a un precio más bajo y con la posibilidad de personalizar acabados." },
  { q:"¿Cómo sé que el desarrollador es confiable?", a:"En capitaldepas verificamos la reputación, trayectoria y documentación legal de cada desarrollador antes de publicar su proyecto en nuestra plataforma." },
  { q:"¿Qué documentos necesito para comprar?", a:"Básicamente: identificación oficial, comprobante de ingresos, estado de cuenta bancario y, en caso de crédito, la documentación que solicite tu banco o Infonavit." },
  { q:"¿Puedo comprar con Infonavit o crédito bancario?", a:"Sí. Muchos de nuestros proyectos son compatibles con crédito Infonavit, Fovissste e hipotecas bancarias. Usa nuestra calculadora para estimar tu mensualidad." },
  { q:"¿Cuánto tiempo toma el proceso de compra?", a:"Desde que eliges tu departamento hasta firmar contrato puede tomar entre 1 y 3 semanas, dependiendo del proyecto y del tipo de financiamiento." },
  { q:"¿Tiene costo usar capitaldepas.com?", a:"No. Para compradores, capitaldepas es completamente gratuito. Nuestra comisión es pagada por los desarrolladores al momento de la venta." },
  ];

// ── Google Sheets integration ─────────────────────────────────────────────────
const _dataSubscribers = new Set();
const _subscribeToDataChanges = (fn) => { _dataSubscribers.add(fn); return () => _dataSubscribers.delete(fn); };
const _notifyDataChange = () => { _dataSubscribers.forEach(fn => fn()); };

const useDataVersion = () => {
    const [, bump] = React.useReducer(x => x + 1, 0);
    React.useEffect(() => _subscribeToDataChanges(bump), []);
};

// STATS global, llenado al cargar /api/projects (con fallback razonable)
let STATS = { projects: PROPERTIES.length, developers: 1, cities: 1 };

fetch('/api/projects')
  .then(r => r.ok ? r.json() : null)
  .then(data => {
        if (data && Array.isArray(data.properties) && data.properties.length > 0) {
                PROPERTIES.length = 0;
                PROPERTIES.push(...data.properties);
        }
        if (data && Array.isArray(data.posts) && data.posts.length > 0) {
                BLOG_POSTS.length = 0;
                BLOG_POSTS.push(...data.posts);
        }
        if (data && data.stats) {
                STATS = {
                        projects: data.stats.projects || PROPERTIES.length,
                        developers: data.stats.developers || 1,
                        cities: data.stats.cities || 1,
                };
        } else {
                STATS = computeStats(PROPERTIES);
        }
        _notifyDataChange();
  })
  .catch(() => { STATS = computeStats(PROPERTIES); _notifyDataChange(); });

// Helper: calcula stats en cliente cuando el API no los provee
function computeStats(props) {
        const devs = new Set();
        const cities = new Set();
        for (const p of props) {
                if (p.developer) devs.add(p.developer.trim().toLowerCase());
                const z = (p.zone || '').toLowerCase().trim();
                const cityMap = {
                        'cdmx':'CDMX','polanco':'CDMX','reforma':'CDMX','reforma centro':'CDMX',
                        'condesa':'CDMX','roma':'CDMX',
                        'cancun':'Cancún','cancún':'Cancún','zona hotelera':'Cancún',
                        'los cabos':'Los Cabos','los-cabos':'Los Cabos',
                };
                const c = cityMap[z] || (z ? z[0].toUpperCase()+z.slice(1) : '');
                if (c) cities.add(c);
        }
        return { projects: props.length, developers: Math.max(1, devs.size), cities: Math.max(1, cities.size) };
}

// ── Mapbox geocoding fallback (cuando un proyecto no tiene lat/lng) ──────────
async function geocodeMissing(props) {
        const token = window.MAPBOX_TOKEN;
        if (!token) return;
        const missing = props.filter(p => !p.hasCoords && p.location);
        for (const p of missing) {
                try {
                        const q = encodeURIComponent(p.location + ', México');
                        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json?access_token=${token}&limit=1&country=mx`;
                        const r = await fetch(url);
                        if (!r.ok) continue;
                        const j = await r.json();
                        const c = j.features && j.features[0] && j.features[0].center;
                        if (c && c.length === 2) {
                                p.lng = c[0]; p.lat = c[1]; p.hasCoords = true;
                        }
                } catch {}
        }
        _notifyDataChange();
}
// Lanzamos el geocoding después del primer fetch
setTimeout(() => geocodeMissing(PROPERTIES), 800);


// ── Shared Hooks ───────────────────────────────────────────────────────────────
const useScrollReveal = (threshold = 0.12) => {
    const ref = React.useRef(null);
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
          const obs = new IntersectionObserver(([e]) => {
                  if(e.isIntersecting) setVisible(true);
          }, { threshold });
          if(ref.current) obs.observe(ref.current);
          return () => obs.disconnect();
    }, []);
    return [ref, visible];
};

const useMagnetic = (strength = 0.35) => {
    const ref = React.useRef(null);
    React.useEffect(() => {
          const el = ref.current;
          if(!el) return;
          const onMove = (e) => {
                  const r = el.getBoundingClientRect();
                  const cx = r.left + r.width/2, cy = r.top + r.height/2;
                  const dx = e.clientX - cx, dy = e.clientY - cy;
                  const dist = Math.sqrt(dx*dx + dy*dy);
                  if(dist < 100) {
                            const s = (100-dist)/100;
                            el.style.transform = `translate(${dx*s*strength}px,${dy*s*strength}px)`;
                  } else {
                            el.style.transform = '';
                  }
          };
          document.addEventListener('mousemove', onMove);
          return () => document.removeEventListener('mousemove', onMove);
    }, []);
    return ref;
};

const useParallax = (factor = 0.05) => {
    const ref = React.useRef(null);
    React.useEffect(() => {
          const el = ref.current;
          if(!el) return;
          const onMove = (e) => {
                  const x = (e.clientX/window.innerWidth - 0.5)*2;
                  const y = (e.clientY/window.innerHeight - 0.5)*2;
                  el.style.transform = `translate(${x*factor*100}px, ${y*factor*100}px)`;
          };
          document.addEventListener('mousemove', onMove);
          return () => document.removeEventListener('mousemove', onMove);
    }, []);
    return ref;
};

const useCounter = (target, duration = 2000) => {
    const [count, setCount] = React.useState(0);
    const [started, setStarted] = React.useState(false);
    const start = () => {
          if(started) return;
          setStarted(true);
          const s = Date.now();
          const tick = () => {
                  const p = Math.min((Date.now()-s)/duration,1);
                  setCount(Math.floor(p*target));
                  if(p<1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
    };
    return [count, start];
};

function PropertyPlaceholder({ hue, height, label }) {
    hue = hue || 220;
    height = height || 200;
    label = label || "";
    return (
          React.createElement('div', {
                  style:{width:'100%', height, background:`linear-gradient(160deg, hsl(${hue},20%,10%), hsl(${hue},15%,6%))`, borderRadius:8, position:'relative', overflow:'hidden', display:'flex', alignItems:'flex-end'}
          },
                                    React.createElement('div', {style:{position:'absolute', inset:0, opacity:0.4}},
                                                                Array.from({length:5}).map((_,row)=>
                                                                            Array.from({length:7}).map((_,col)=>
                                                                                          React.createElement('div', {
                                                                                                          key:`${row}-${col}`,
                                                                                                          style:{position:'absolute', width:10, height:14, borderRadius:2, background:`hsla(${hue},40%,70%,${Math.random()>0.4?0.6:0.1})`, left:12+col*18, top:20+row*26}
                                                                                            })
                                                                                                                 )
                                                                                                   )
                                                              ),
                                    label ? React.createElement('div', {style:{padding:'8px 12px', fontSize:11, color:'rgba(255,255,255,0.5)', fontFamily:'DM Sans', letterSpacing:2, textTransform:'uppercase'}}, label) : null
                                  )
        );
}

// ── WhatsApp display number (from /api/config) ──
// Returns null until the config fetch resolves, then the raw digits string
// (e.g. "14155238886") or null/empty if env var unset. Components should
// gate on this and skip rendering WhatsApp UI when null/empty.
const useWhatsAppNumber = () => {
    const [num, setNum] = React.useState(window.WHATSAPP_DISPLAY_NUMBER || null);
    React.useEffect(() => {
          if (num) return;
          if (window.WHATSAPP_READY && typeof window.WHATSAPP_READY.then === 'function') {
                  window.WHATSAPP_READY.then(v => setNum(v || null));
          }
    }, []);
    return num;
};

Object.assign(window, {
    PROPERTIES, BLOG_POSTS, TESTIMONIALS, FAQS,
    useScrollReveal, useMagnetic, useParallax, useCounter, useDataVersion, useWhatsAppNumber,
    PropertyPlaceholder
});
