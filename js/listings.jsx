// ── capitaldepas.com · Listings ──────────────────────────────────────────────

// Maps raw sheet zone values to filter bucket IDs
const ZONE_BUCKETS = {
    'cdmx':'cdmx','polanco':'cdmx','reforma':'cdmx','reforma centro':'cdmx','condesa':'cdmx','roma':'cdmx',
    'santa fe':'cdmx','narvarte':'cdmx','del valle':'cdmx','zona oriente':'cdmx',
    'granjas mexico':'cdmx','granjas m\u00e9xico':'cdmx','iztapalapa':'cdmx','iztacalco':'cdmx',
    'benito juarez':'cdmx','benito ju\u00e1rez':'cdmx','miguel hidalgo':'cdmx','cuauhtemoc':'cdmx','cuauht\u00e9moc':'cdmx',
    'cancun':'cancun','canc\u00fan':'cancun','zona hotelera':'cancun','playa del carmen':'cancun','tulum':'cancun',
    'los cabos':'cabos','los-cabos':'cabos','cabo san lucas':'cabos','san jose del cabo':'cabos','san jos\u00e9 del cabo':'cabos',
    'guadalajara':'guadalajara','zapopan':'guadalajara','tlaquepaque':'guadalajara',
    'monterrey':'monterrey','san pedro garza garcia':'monterrey','san pedro garza garc\u00eda':'monterrey',
    'oaxaca':'oaxaca',
    'acapulco':'acapulco','acapulco diamante':'acapulco','costera miguel aleman':'acapulco','costera miguel alem\u00e1n':'acapulco',
    'puerto vallarta':'vallarta','nuevo vallarta':'vallarta','riviera nayarit':'vallarta',
};

function zoneToFilter(zone) {
    if (!zone) return null;
    return ZONE_BUCKETS[zone.toLowerCase().trim()] || null;
}

const BUCKET_LABELS = {'cdmx':'CDMX','cancun':'Canc\u00fan','cabos':'Los Cabos','guadalajara':'Guadalajara','monterrey':'Monterrey','oaxaca':'Oaxaca','acapulco':'Acapulco','vallarta':'Vallarta'};

const PropertyCard = ({ prop, setPage, setSelectedProperty }) => { const cardRef = React.useRef(null); const [tilt, setTilt] = React.useState({ x:0, y:0 }); const [hovered, setHovered] = React.useState(false); const onMouseMove = (e) => { const r = cardRef.current.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height; setTilt({ x:(y-0.5)*10, y:(x-0.5)*-10 }); }; const handleClick = () => { setSelectedProperty(prop); setPage('project'); window.scrollTo(0,0); }; return ( <div ref={cardRef} onClick={handleClick} onMouseMove={onMouseMove} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>{setHovered(false);setTilt({x:0,y:0});}} data-cursor="property" style={{ background:'#fff', border:`1.5px solid ${hovered?'rgba(21,80,232,0.3)':'rgba(0,0,0,0.06)'}`, borderRadius:20, overflow:'hidden', cursor:'pointer', boxShadow: hovered?'0 20px 60px rgba(21,80,232,0.12), 0 4px 20px rgba(0,0,0,0.06)':'0 2px 12px rgba(0,0,0,0.06)', transform:`perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered?1.02:1})`, transformStyle:'preserve-3d', transitionProperty:'transform,border-color,box-shadow', transitionDuration:hovered?'0.05s,0.3s,0.3s':'0.5s,0.3s,0.3s', }}>
        <div style={{ height:200, position:'relative', overflow:'hidden', background: prop.photos && prop.photos[0] ? `url(${prop.photos[0]}) center/cover` : `linear-gradient(160deg,hsl(${prop.accentHue},55%,88%),hsl(${prop.accentHue},40%,78%))` }}>
          {(!prop.photos || !prop.photos[0]) && Array.from({length:5}).map((_,r)=>Array.from({length:7}).map((_,c)=>( <div key={`${r}${c}`} style={{ position:'absolute', width:10, height:14, borderRadius:2, background:`hsla(${prop.accentHue},50%,25%,${Math.random()>0.4?0.35:0.07})`, left:14+c*20, top:16+r*30 }} /> )))}
                  <div style={{ position:'absolute', top:14, left:14, background:prop.type==='preventa'?'#1550E8':'#16a34a', color:'#fff', fontSize:10, fontFamily:'DM Sans', fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', padding:'4px 10px', borderRadius:100 }}>{prop.type}</div>div>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.3),transparent)', opacity:hovered?1:0, transition:'opacity 0.3s', display:'flex', alignItems:'flex-end', justifyContent:'center', paddingBottom:16 }}>{hovered && <span style={{ fontFamily:'DM Sans', fontSize:12, color:'#fff', letterSpacing:2, textTransform:'uppercase', fontWeight:700 }}>Ver proyecto →</span>span>}</div>div>
        </div>div>
        <div style={{ padding:'18px 20px 20px' }}><div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}><div><div style={{ fontFamily:'DM Sans', fontSize:15, fontWeight:700, color:'#0E0E0C' }}>{prop.name}</div>div><div style={{ fontFamily:'DM Sans', fontSize:12, color:'#9E9890', marginTop:3, display:'flex', alignItems:'center', gap:5 }}><svg width="10" height="12" viewBox="0 0 24 28" fill="#1550E8" opacity="0.5"><path d="M12 0C7.6 0 4 3.6 4 8c0 6 8 18 8 18s8-12 8-18c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"/></svg>svg>{prop.location}</div>div></div>div><div style={{ fontFamily:'DM Sans', fontSize:20, fontWeight:800, color:'#1550E8' }}>{prop.priceStr}</div>div></div>div>
              <div style={{ display:'flex', gap:16, margin:'12px 0', paddingTop:12, borderTop:'1px solid rgba(0,0,0,0.05)' }}>{[{icon:'🛏',val:`${prop.beds} rec.`},{icon:'🚿',val:`${prop.baths} ba\u00f1os`},{icon:'📐',val:`${prop.sqm} m²`}].map(item=>(<div key={item.val} style={{ fontFamily:'DM Sans', fontSize:12, color:'#6B6560', display:'flex', alignItems:'center', gap:5 }}><span style={{fontSize:13}}>{item.icon}</span>span>{item.val}</div>div>))}</div>div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}><div style={{ fontFamily:'DM Sans', fontSize:11, color:'#9E9890' }}>Entrega: <span style={{color:'#1550E8',fontWeight:600}}>{prop.completion}</span>span></div>div><div style={{ fontFamily:'DM Sans', fontSize:11, color:'#9E9890' }}>{prop.developer}</div>div></div>div>
        </div>div></div>div> ); };

const Listings = ({ setPage, setSelectedProperty }) => {
    useDataVersion(); // re-render when API data loads from Google Sheets
    const [filter, setFilter] = React.useState('todos');
    const [typeFilter, setTypeFilter] = React.useState('todos');
    const [sortBy, setSortBy] = React.useState('default');
    const [search, setSearch] = React.useState('');
    const [ref, vis] = useScrollReveal(0.05);
  
    // Build zone chips dynamically from loaded data
    const availableBuckets = React.useMemo(() => { const seen = new Set(); PROPERTIES.forEach(p => { const b = zoneToFilter(p.zone); if (b) seen.add(b); }); return seen; }, [PROPERTIES.length]);
    const zones = React.useMemo(() => { const chips = [{ id:'todos', label:'Todos' }]; ['cdmx','cancun','cabos','guadalajara','monterrey','oaxaca','acapulco','vallarta'].filter(b => availableBuckets.has(b)).forEach(b => chips.push({ id:b, label: BUCKET_LABELS[b] || b })); return chips; }, [availableBuckets]);
    React.useEffect(() => { if (filter !== 'todos' && !availableBuckets.has(filter)) setFilter('todos'); }, [availableBuckets]);
  
    let filtered = PROPERTIES.filter(p => { if (filter !== 'todos' && zoneToFilter(p.zone) !== filter) return false; if (typeFilter !== 'todos' && p.type !== typeFilter) return false; if (search) { const q = search.toLowerCase(); if (!p.name.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false; } return true; });
    if(sortBy==='price-asc') filtered=[...filtered].sort((a,b)=>a.price-b.price); if(sortBy==='price-desc') filtered=[...filtered].sort((a,b)=>b.price-a.price);
  
    const chipStyle = (active) => ({ fontFamily:'DM Sans', fontSize:13, fontWeight:active?700:500, color:active?'#fff':'#6B6560', background:active?'#1550E8':'#fff', border:`1.5px solid ${active?'#1550E8':'rgba(0,0,0,0.1)'}`, borderRadius:100, padding:'7px 18px', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap', boxShadow:active?'0 4px 12px rgba(21,80,232,0.25)':'none', });
  
    return ( <div style={{ minHeight:'100vh', background:'#F5F3EE', padding:'120px 60px 80px' }}> <div ref={ref} style={{ opacity:vis?1:0, transform:vis?'none':'translateY(30px)', transition:'all 0.8s ease' }}>
          <div style={{ marginBottom:44 }}><div style={{ fontFamily:'DM Sans', fontSize:12, letterSpacing:4, color:'rgba(21,80,232,0.6)', textTransform:'uppercase', marginBottom:10 }}>Marketplace</div>div><h2 style={{ fontFamily:'Playfair Display', fontSize:52, fontWeight:700, color:'#0E0E0C', margin:0, letterSpacing:-1 }}>Encuentra tu <span style={{ color:'#1550E8' }}>departamento</span>span></h2>h2><p style={{ fontFamily:'DM Sans', fontSize:16, color:'#9E9890', marginTop:10 }}>{PROPERTIES.length} proyectos disponibles en M\u00e9xico</p>p></div>div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:28, alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, background:'#fff', border:'1.5px solid rgba(0,0,0,0.08)', borderRadius:100, padding:'7px 18px', minWidth:250 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1550E8" strokeWidth="2" opacity="0.6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>svg><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar proyecto o colonia..." style={{ background:'none', border:'none', outline:'none', fontFamily:'DM Sans', fontSize:13, color:'#0E0E0C', width:'100%', caretColor:'#1550E8' }} /></div>div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>{zones.map(z=><button key={z.id} onClick={()=>setFilter(z.id)} style={chipStyle(filter===z.id)} data-cursor="pointer">{z.label}</button>button>)}</div>div>
                  <div style={{ display:'flex', gap:8, marginLeft:'auto' }}>{['todos','preventa','venta'].map(t=><button key={t} onClick={()=>setTypeFilter(t)} style={chipStyle(typeFilter===t)} data-cursor="pointer">{t==='todos'?'Todos':t.charAt(0).toUpperCase()+t.slice(1)}</button>button>)}</div>div>
                  <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ background:'#fff', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:100, padding:'7px 18px', fontFamily:'DM Sans', fontSize:13, color:'#6B6560', cursor:'pointer', outline:'none' }}><option value="default">Ordenar</option>option><option value="price-asc">Precio: menor</option>option><option value="price-desc">Precio: mayor</option>option></select>select>
          </div>div>
      {filtered.length>0 ? ( <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:24 }}>{filtered.map(p=><PropertyCard key={p.id} prop={p} setPage={setPage} setSelectedProperty={setSelectedProperty}/>)}</div>div> ) : ( <div style={{ textAlign:'center', padding:'80px 0', color:'#9E9890' }}><div style={{ fontSize:48, marginBottom:16 }}>🏢</div>div><div style={{ fontFamily:'DM Sans', fontSize:16 }}>No encontramos proyectos con esos filtros.</div>div></div>div> )}
    </div>div> </div>div> ); };

Object.assign(window, { Listings, PropertyCard });</div>
