
// ── capitaldepas.com · Data & Shared Hooks ───────────────────────────────────
//
// Los datos de proyectos vienen de Google Sheets (vía /api/projects).
// Mientras cargan, mostramos los placeholders definidos abajo.
// Si la API falla o no hay filas en la hoja, el sitio sigue funcionando
// con los placeholders sin romperse.
// ─────────────────────────────────────────────────────────────────────────────

let PROPERTIES = [
  { id:"torre-polanco",          slug:"torre-polanco",          name:"Torre Polanco",           location:"Polanco, CDMX",              zone:"cdmx",   price:3200000, priceStr:"$3.2M", beds:2, baths:2, sqm:85,  type:"preventa", completion:"Q4 2026", developer:"Placeholder Dev", amenities:["Alberca","Gimnasio","Roof garden","Lobby 24h"],                 desc:"Departamentos de alto diseño en el corazón de Polanco. Acabados de primera, vistas panorámicas y ubicación privilegiada.", accentHue:220, photos:[] },
  { id:"residencial-santafe",    slug:"residencial-santafe",    name:"Residencial Santa Fe",    location:"Santa Fe, CDMX",             zone:"cdmx",   price:4500000, priceStr:"$4.5M", beds:3, baths:2, sqm:120, type:"preventa", completion:"Q2 2027", developer:"Placeholder Dev", amenities:["Coworking","Spa","Roof terrace","Smart home"],                  desc:"Living corporativo redefinido en Santa Fe. Espacios amplios, tecnología de punta y una comunidad exclusiva.", accentHue:45,  photos:[] },
  { id:"roma-lofts",             slug:"roma-lofts",             name:"Roma Lofts",              location:"Roma Norte, CDMX",           zone:"cdmx",   price:2800000, priceStr:"$2.8M", beds:1, baths:1, sqm:65,  type:"venta",    completion:"Q1 2026", developer:"Placeholder Dev", amenities:["Pet friendly","Bici estacionamiento","Jardín","Seguridad 24h"], desc:"Lofts industriales con carácter en la colonia más cool de la ciudad.", accentHue:15,  photos:[] },
  { id:"laguna-cancun",          slug:"laguna-cancun",          name:"Laguna Cancún",           location:"Zona Hotelera, Cancún",      zone:"cancun", price:5200000, priceStr:"$5.2M", beds:2, baths:2, sqm:95,  type:"preventa", completion:"Q3 2027", developer:"Placeholder Dev", amenities:["Vista al mar","Marina privada","Alberca infinita","Concierge"],desc:"Frente al Mar Caribe, con marina privada y amenidades de resort 5 estrellas.", accentHue:185, photos:[] },
  { id:"vista-los-cabos",        slug:"vista-los-cabos",        name:"Vista Los Cabos",         location:"San José del Cabo, BCS",     zone:"cabos",  price:8900000, priceStr:"$8.9M", beds:3, baths:3, sqm:150, type:"preventa", completion:"Q1 2028", developer:"Placeholder Dev", amenities:["Playa privada","Golf","Spa","Helipuerto"],                      desc:"Residencias de ultra lujo con vistas al Pacífico y acceso a playa privada exclusiva.", accentHue:200, photos:[] },
  { id:"condesa-202",            slug:"condesa-202",            name:"Condesa 202",             location:"Condesa, CDMX",              zone:"cdmx",   price:3800000, priceStr:"$3.8M", beds:2, baths:2, sqm:90,  type:"preventa", completion:"Q2 2026", developer:"Placeholder Dev", amenities:["Roof garden","BBQ","Smart home","Coworking"],                   desc:"Arquitectura contemporánea en la Condesa. Diseño sofisticado con alma de barrio.", accentHue:120, photos:[] },
  { id:"bahia-puerto-escondido", slug:"bahia-puerto-escondido", name:"Bahía Puerto Escondido",  location:"Puerto Escondido, Oax.",     zone:"oaxaca", price:2100000, priceStr:"$2.1M", beds:1, baths:1, sqm:55,  type:"preventa", completion:"Q3 2027", developer:"Placeholder Dev", amenities:["Surf access","Alberca","Palapa","Vista oceánica"],              desc:"El paraíso del surf convertido en hogar. Diseño tropical moderno frente al Pacífico Sur.", accentHue:160, photos:[] },
  { id:"altius-reforma",         slug:"altius-reforma",         name:"Altius Reforma",          location:"Reforma, CDMX",              zone:"cdmx",   price:6200000, priceStr:"$6.2M", beds:3, baths:3, sqm:160, type:"preventa", completion:"Q4 2027", developer:"Placeholder Dev", amenities:["Pisos 40+","Alberca climatizada","Lounge sky","Valet"],         desc:"El proyecto más alto de Paseo de la Reforma. Vivir en las alturas con vistas 360° de la ciudad.", accentHue:260, photos:[] },
];

let BLOG_POSTS = [
  { id:1, slug:"guia-preventa-2026",        title:"Guía para comprar en preventa en 2026",                    cat:"Guía",       date:"18 Abr 2026", read:"6 min", excerpt:"Todo lo que necesitas saber antes de firmar un contrato de preventa: beneficios, riesgos y cómo proteger tu inversión.", accentHue:45,  body:"" },
  { id:2, slug:"mejores-desarrollos-playa", title:"Los mejores desarrollos cerca de la playa en México",      cat:"Tendencias", date:"10 Abr 2026", read:"4 min", excerpt:"Cancún, Los Cabos, Puerto Escondido: analizamos los proyectos con mayor potencial de plusvalía en 2026.", accentHue:185, body:"" },
  { id:3, slug:"infonavit-vs-hipoteca",     title:"Crédito Infonavit vs hipoteca bancaria: ¿cuál te conviene?",cat:"Finanzas",   date:"2 Abr 2026",  read:"5 min", excerpt:"Comparamos las mejores opciones de financiamiento disponibles hoy y cómo elegir la más adecuada para tu situación.", accentHue:220, body:"" },
];

const TESTIMONIALS = [
  { id:1, name:"Sofía Ramírez",  role:"Compradora, Polanco",       text:"capitaldepas.com me hizo el proceso increíblemente sencillo. Encontré mi depa en Polanco en menos de una semana y el asesor estuvo disponible en todo momento.", stars:5, initials:"SR" },
  { id:2, name:"Carlos Mendoza", role:"Inversor, Cancún",          text:"Tengo 3 departamentos en preventa gracias a capitaldepas. La plataforma es transparente, los desarrolladores son serios y el ROI ha sido excelente.", stars:5, initials:"CM" },
  { id:3, name:"Ana González",   role:"Primera compradora, Roma",  text:"Como compradora primeriza estaba muy nerviosa, pero el equipo me guió paso a paso. La calculadora de crédito fue súper útil para entender mis opciones.", stars:5, initials:"AG" },
  { id:4, name:"Diego Herrera",  role:"Desarrollador, Santa Fe",   text:"Como desarrolladora, capitaldepas nos ha conectado con compradores calificados que de otra forma nunca hubiéramos alcanzado. Excelente plataforma.", stars:5, initials:"DH" },
];

const FAQS = [
  { q:"¿Qué es una preventa?",                                     a:"Una preventa es la venta de un inmueble antes de que sea construido o terminado. Esto te permite adquirirlo a un precio más bajo y con la posibilidad de personalizar acabados." },
  { q:"¿Cómo sé que el desarrollador es confiable?",               a:"En capitaldepas verificamos la reputación, trayectoria y documentación legal de cada desarrollador antes de publicar su proyecto en nuestra plataforma." },
  { q:"¿Qué documentos necesito para comprar?",                    a:"Básicamente: identificación oficial, comprobante de ingresos, estado de cuenta bancario y, en caso de crédito, la documentación que solicite tu banco o Infonavit." },
  { q:"¿Puedo comprar con Infonavit o crédito bancario?",          a:"Sí. Muchos de nuestros proyectos son compatibles con crédito Infonavit, Fovissste e hipotecas bancarias. Usa nuestra calculadora para estimar tu mensualidad." },
  { q:"¿Cuánto tiempo toma el proceso de compra?",                 a:"Desde que eliges tu departamento hasta firmar contrato puede tomar entre 1 y 3 semanas, dependiendo del proyecto y del tipo de financiamiento." },
  { q:"¿Tiene costo usar capitaldepas.com?",                       a:"No. Para compradores, capitaldepas es completamente gratuito. Nuestra comisión es pagada por los desarrolladores al momento de la venta." },
];

// ── Google Sheets integration ─────────────────────────────────────────────────
// Al cargar la página, pedimos los datos reales al API (/api/projects), que
// internamente lee la hoja de Google. Si la respuesta trae filas, reemplazamos
// los placeholders in-place. Los componentes suscritos se re-renderizan.

const _dataSubscribers = new Set();
const _subscribeToDataChanges = (fn) => { _dataSubscribers.add(fn); return () => _dataSubscribers.delete(fn); };
const _notifyDataChange = () => { _dataSubscribers.forEach(fn => fn()); };

// Hook que el componente raíz usa para re-renderizar cuando llega data nueva.
const useDataVersion = () => {
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => _subscribeToDataChanges(bump), []);
};

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
    _notifyDataChange();
  })
  .catch(() => { /* mantener placeholders en silencio si no hay API aún */ });

// ── Shared Hooks ──────────────────────────────────────────────────────────────

const useScrollReveal = (threshold = 0.12) => {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVisible(true); }, { threshold });
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const useMagnetic = (strength = 0.35) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if(!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 100) {
        const s = (100 - dist) / 100;
        el.style.transform = `translate(${dx*s*strength}px,${dy*s*strength}px)`;
      } else { el.style.transform = ''; }
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);
  return ref;
};

const useParallax = (factor = 0.05) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if(!el) return;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.transform = `translate(${x * factor * 100}px, ${y * factor * 100}px)`;
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
    if(started) return; setStarted(true);
    const s = Date.now();
    const tick = () => {
      const p = Math.min((Date.now()-s)/duration, 1);
      setCount(Math.floor(p * target));
      if(p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  return [count, start];
};

// Placeholder visual para cards sin fotos — patrón de ventanitas sobre gradiente
const PropertyPlaceholder = ({ hue=220, height=200, label="" }) => (
  <div style={{width:'100%', height, background:`linear-gradient(160deg, hsl(${hue},20%,10%), hsl(${hue},15%,6%))`, borderRadius:8, position:'relative', overflow:'hidden', display:'flex', alignItems:'flex-end'}}>
    <div style={{position:'absolute', inset:0, opacity:0.4}}>
      {Array.from({length:5}).map((_,row)=>
        Array.from({length:7}).map((_,col)=>(
          <div key={`${row}-${col}`} style={{position:'absolute', width:10, height:14, borderRadius:2, background:`hsla(${hue},40%,70%,${Math.random()>0.4?0.6:0.1})`, left:12+col*18, top:20+row*26}} />
        ))
      )}
    </div>
    {label && <div style={{padding:'8px 12px', fontSize:11, color:'rgba(255,255,255,0.5)', fontFamily:'DM Sans', letterSpacing:2, textTransform:'uppercase'}}>{label}</div>}
  </div>
);

Object.assign(window, {
  PROPERTIES, BLOG_POSTS, TESTIMONIALS, FAQS,
  useScrollReveal, useMagnetic, useParallax, useCounter, useDataVersion,
  PropertyPlaceholder
});
