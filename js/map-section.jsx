// ── capitaldepas.com · Map Section (Mapbox GL JS) ──────────────────
//
// Mapa interactivo con todos los desarrollos como pins. Tambien exporta
// MiniMapa para usarse dentro del detalle de un proyecto.
// El token de Mapbox se carga async desde /api/config (window.MAPBOX_TOKEN_READY).
// ──────────────────────────────────────────────────────────────────────────────────
const MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v11';
const MX_CENTER = [-99.1332, 19.4326];
const MX_BOUNDS = [[-118, 14], [-86, 33]];

function applyMapboxToken(tok) {
  if (typeof mapboxgl === 'undefined') return false;
  if (!mapboxgl.accessToken && tok) mapboxgl.accessToken = tok;
  return !!mapboxgl.accessToken;
}

// Hook: resuelve cuando window.MAPBOX_TOKEN esta listo (o falla).
function useMapboxReady() {
  const [ready, setReady] = React.useState(
    typeof mapboxgl !== 'undefined' && !!(window.MAPBOX_TOKEN || mapboxgl.accessToken)
  );
  React.useEffect(() => {
    if (ready) { applyMapboxToken(window.MAPBOX_TOKEN); return; }
    let cancelled = false;
    function tryReady() {
      if (cancelled) return;
      if (typeof mapboxgl !== 'undefined' && (window.MAPBOX_TOKEN || mapboxgl.accessToken)) {
        applyMapboxToken(window.MAPBOX_TOKEN);
        setReady(true);
        return true;
      }
      return false;
    }
    if (window.MAPBOX_TOKEN_READY && typeof window.MAPBOX_TOKEN_READY.then === 'function') {
      window.MAPBOX_TOKEN_READY.then(() => tryReady());
    }
    // Polling de seguridad por si el promise resolvio antes del mount
    const iv = setInterval(() => { if (tryReady()) clearInterval(iv); }, 250);
    setTimeout(() => clearInterval(iv), 8000);
    return () => { cancelled = true; clearInterval(iv); };
  }, [ready]);
  return ready;
}

// ── MapSection: vista general con todos los pins ──────────────────
const MapSection = ({ setPage, setSelectedProperty }) => {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const markersRef = React.useRef([]);
  const [ready, setReady] = React.useState(false);
  const [ref, vis] = useScrollReveal();
  const tokenReady = useMapboxReady();

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!tokenReady) return;
    if (!applyMapboxToken(window.MAPBOX_TOKEN)) return;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE,
      center: MX_CENTER,
      zoom: 4.4,
      maxBounds: [[-130, 5], [-75, 38]],
      attributionControl: false,
      cooperativeGestures: true,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    mapRef.current = map;
    map.on('load', () => setReady(true));
    return () => { try { map.remove(); } catch(e){} mapRef.current = null; };
  }, [tokenReady]);

  useDataVersion();
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    const valid = PROPERTIES.filter(p => p.hasCoords && Number.isFinite(p.lat) && Number.isFinite(p.lng));
    if (valid.length === 0) return;
    const bounds = new mapboxgl.LngLatBounds();
    valid.forEach(p => {
      const el = document.createElement('div');
      el.style.cssText = 'width:32px;height:32px;border-radius:50% 50% 50% 0;background:#1550E8;border:3px solid #fff;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(21,80,232,0.45);cursor:pointer;display:flex;align-items:center;justify-content:center;';
      const dot = document.createElement('div');
      dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#fff;transform:rotate(45deg);';
      el.appendChild(dot);
      const popup = new mapboxgl.Popup({ offset: 28, closeButton: false })
        .setHTML(
          '<div style="min-width:180px">' +
            '<div style="font-weight:700;color:#0E0E0C;font-size:14px;margin-bottom:2px">' + p.name + '</div>' +
            '<div style="font-size:12px;color:#9E9890;margin-bottom:6px">' + (p.location || '') + '</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px">' +
              '<span style="color:#1550E8;font-weight:700;font-size:14px">' + (p.priceStr || '') + '</span>' +
              '<span data-slug="' + p.slug + '" class="capdepas-popup-link" style="font-size:11px;color:#1550E8;text-transform:uppercase;letter-spacing:1px;font-weight:600;cursor:pointer">Ver →</span>' +
            '</div>' +
          '</div>'
        );
      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([p.lng, p.lat]).setPopup(popup).addTo(map);
      markersRef.current.push(marker);
      bounds.extend([p.lng, p.lat]);
      popup.on('open', () => {
        setTimeout(() => {
          const link = document.querySelector('.capdepas-popup-link[data-slug="' + p.slug + '"]');
          if (link) link.onclick = () => {
            setSelectedProperty && setSelectedProperty(p);
            setPage && setPage('detail');
          };
        }, 0);
      });
    });
    if (valid.length === 1) {
      map.flyTo({ center: [valid[0].lng, valid[0].lat], zoom: 12, essential: true });
    } else {
      map.fitBounds(bounds, { padding: 60, duration: 800, maxZoom: 11 });
    }
  }, [ready, vis, PROPERTIES.length]);

  return (
    <section style={{ background:'#F5F3EE', padding:'100px 0', overflow:'hidden' }}>
      <div ref={ref} style={{ opacity:vis?1:0, transform:vis?'none':'translateY(40px)', transition:'all 0.9s ease' }}>
        <div style={{ textAlign:'center', marginBottom:48, padding:'0 60px' }}>
          <div style={{ fontFamily:'DM Sans', fontSize:12, letterSpacing:4, color:'rgba(21,80,232,0.6)', textTransform:'uppercase', marginBottom:12 }}>Cobertura Nacional</div>
          <h2 style={{ fontFamily:'Playfair Display', fontSize:48, fontWeight:700, color:'#0E0E0C', margin:0, letterSpacing:-1 }}>
            Proyectos en todo <span style={{ color:'#1550E8' }}>México</span>
          </h2>
          <p style={{ fontFamily:'DM Sans', fontSize:16, color:'#9E9890', marginTop:12 }}>Haz clic en un pin para ver el desarrollo.</p>
        </div>
        <div style={{ padding:'0 60px' }}>
          <div ref={containerRef} style={{ width:'100%', height:520, borderRadius:20, overflow:'hidden', border:'1px solid rgba(21,80,232,0.12)', boxShadow:'0 12px 40px rgba(21,80,232,0.08)', background:'#EEF2FF' }} />
        </div>
      </div>
    </section>
  );
};

// ── MiniMapa: para usar dentro del detalle de un proyecto ───────────────
const MiniMapa = ({ prop, height = 280 }) => {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const tokenReady = useMapboxReady();
  React.useEffect(() => {
    if (!containerRef.current || !prop || !tokenReady) return;
    if (!applyMapboxToken(window.MAPBOX_TOKEN)) return;
    if (mapRef.current) { try { mapRef.current.remove(); } catch(e){} mapRef.current = null; }
    if (!prop.hasCoords || !Number.isFinite(prop.lat) || !Number.isFinite(prop.lng)) return;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE,
      center: [prop.lng, prop.lat],
      zoom: 14,
      attributionControl: false,
      interactive: true,
      cooperativeGestures: true,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    const el = document.createElement('div');
    el.style.cssText = 'width:32px;height:32px;border-radius:50% 50% 50% 0;background:#1550E8;border:3px solid #fff;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(21,80,232,0.45);';
    new mapboxgl.Marker({ element: el, anchor: 'bottom' }).setLngLat([prop.lng, prop.lat]).addTo(map);
    mapRef.current = map;
    return () => { try { map.remove(); } catch(e){} mapRef.current = null; };
  }, [tokenReady, prop && prop.slug, prop && prop.lat, prop && prop.lng]);
  if (!prop) return null;
  if (!prop.hasCoords) {
    return (
      <div style={{ height, borderRadius:16, background:'#EEF2FF', border:'1.5px solid rgba(21,80,232,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Sans', fontSize:13, color:'#9E9890' }}>
        Ubicación del desarrollo: {prop.location}
      </div>
    );
  }
  return (
    <div ref={containerRef} style={{ width:'100%', height, borderRadius:16, overflow:'hidden', border:'1px solid rgba(21,80,232,0.12)', background:'#EEF2FF' }} />
  );
};

Object.assign(window, { MapSection, MiniMapa });
