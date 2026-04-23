
// ── capitaldepas.com · Hero (Light Theme, 3 Variants) ─────────────────────────

const HeroStat = ({ target, suffix='', label }) => {
  const [count, startCount] = useCounter(target);
  const [ref, vis] = useScrollReveal(0.1);
  React.useEffect(() => { if(vis) startCount(); }, [vis]);
  return (
    <div ref={ref} style={{ textAlign:'center' }}>
      <div style={{ fontFamily:'Playfair Display', fontSize:40, fontWeight:700, color:'#1550E8', lineHeight:1 }}>{vis?count:0}{suffix}</div>
      <div style={{ fontFamily:'DM Sans', fontSize:12, color:'#9E9890', marginTop:4, letterSpacing:1.5, textTransform:'uppercase' }}>{label}</div>
    </div>
  );
};

const FloatingCard = ({ prop, style, parallaxFactor }) => {
  const ref = useParallax(parallaxFactor);
  if (!prop) return null;
  return (
    <div ref={ref} style={{ position:'absolute', ...style, background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:16, padding:'14px 18px', backdropFilter:'blur(16px)', boxShadow:'0 20px 60px rgba(0,0,0,0.12)', minWidth:200, transition:'transform 0.06s linear', pointerEvents:'none', zIndex:2 }}>
      <div style={{ width:'100%', height:80, borderRadius:8, marginBottom:10, background:`linear-gradient(135deg,hsl(${prop.accentHue},60%,88%),hsl(${prop.accentHue},45%,78%))`, position:'relative', overflow:'hidden' }}>
        {Array.from({length:3}).map((_,r)=>Array.from({length:4}).map((_,c)=>(
          <div key={`${r}${c}`} style={{ position:'absolute', width:8, height:10, borderRadius:1, background:`hsla(${prop.accentHue},50%,30%,${Math.random()>0.4?0.4:0.1})`, left:10+c*18, top:8+r*22 }} />
        )))}
      </div>
      <div style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:600, color:'#0E0E0C' }}>{prop.name}</div>
      <div style={{ fontFamily:'DM Sans', fontSize:11, color:'#9E9890', marginTop:2 }}>{prop.location}</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, alignItems:'center' }}>
        <span style={{ fontFamily:'DM Sans', fontSize:15, color:'#1550E8', fontWeight:700 }}>{prop.priceStr}</span>
        <span style={{ fontFamily:'DM Sans', fontSize:10, background:'rgba(21,80,232,0.1)', color:'#1550E8', padding:'3px 8px', borderRadius:100, textTransform:'uppercase', letterSpacing:1, fontWeight:600 }}>{prop.type}</span>
      </div>
    </div>
  );
};

// ── Variant 1: Cinematic ──────────────────────────────────────────────────────
const HeroCinematic = ({ setPage, searchQuery, setSearchQuery, searchType, setSearchType }) => {
  const bgRef = useParallax(0.012);
  const [scrambled, setScrambled] = React.useState('Encuentra tu');
  const chars = 'ABCDEFGHIJKLMN0123456789@#';

  React.useEffect(() => {
    const target = 'Encuentra tu';
    let iter = 0;
    const iv = setInterval(() => {
      setScrambled(target.split('').map((c,i)=>{ if(c===' ') return ' '; if(i<iter) return c; return chars[Math.floor(Math.random()*chars.length)]; }).join(''));
      if(++iter > target.length) clearInterval(iv);
    }, 55);
    return () => clearInterval(iv);
  }, []);

  const particles = React.useMemo(()=>Array.from({length:20}).map((_,i)=>({ id:i, x:Math.random()*100, y:Math.random()*100, size:Math.random()*4+2, opacity:Math.random()*0.25+0.08, dur:Math.random()*4+3, delay:Math.random()*5 })),[]);

  return (
    <section style={{ position:'relative', height:'100vh', overflow:'hidden', display:'flex', alignItems:'center', background:'#F5F3EE' }}>
      {/* Animated background blobs */}
      <div ref={bgRef} style={{ position:'absolute', inset:'-10%', transition:'transform 0.08s linear' }}>
        <div style={{ position:'absolute', top:'10%', right:'15%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(21,80,232,0.08),transparent 70%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:'20%', right:'30%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(21,80,232,0.05),transparent 70%)', filter:'blur(30px)' }} />
      </div>

      {/* Grid pattern */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.04 }}>
        {Array.from({length:15}).map((_,i)=>(
          <React.Fragment key={i}>
            <line x1={`${i*7}%`} y1="0" x2={`${i*7}%`} y2="100%" stroke="#1550E8" strokeWidth="1"/>
            <line x1="0" y1={`${i*7}%`} x2="100%" y2={`${i*7}%`} stroke="#1550E8" strokeWidth="1"/>
          </React.Fragment>
        ))}
      </svg>

      {/* Blue particles */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}>
        {particles.map(p=>(
          <circle key={p.id} cx={`${p.x}%`} cy={`${p.y}%`} r={p.size} fill="#1550E8" opacity={p.opacity}>
            <animate attributeName="cy" values={`${p.y}%;${p.y-6}%;${p.y}%`} dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite"/>
            <animate attributeName="opacity" values={`${p.opacity};${p.opacity*0.3};${p.opacity}`} dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>

      {/* Floating property cards */}
      <FloatingCard prop={PROPERTIES[0]} style={{ right:'26%', top:'14%' }} parallaxFactor={0.035} />
      <FloatingCard prop={PROPERTIES[3]} style={{ right:'6%', top:'32%' }} parallaxFactor={0.055} />
      <FloatingCard prop={PROPERTIES[4]} style={{ right:'20%', bottom:'16%' }} parallaxFactor={0.025} />

      {/* Main content */}
      <div style={{ position:'relative', zIndex:3, maxWidth:660, padding:'0 80px', marginTop:60 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(21,80,232,0.08)', border:'1px solid rgba(21,80,232,0.18)', borderRadius:100, padding:'7px 16px', marginBottom:28 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#1550E8' }} />
          <span style={{ fontFamily:'DM Sans', fontSize:12, color:'#1550E8', letterSpacing:2, textTransform:'uppercase', fontWeight:600 }}>Nueva plataforma de preventa</span>
        </div>

        <h1 style={{ fontFamily:'Playfair Display', fontSize:72, fontWeight:700, lineHeight:1.05, margin:'0 0 8px' }}>
          <span style={{ color:'#0E0E0C', display:'block', letterSpacing:-1 }}>{scrambled}</span>
          <span style={{ background:'linear-gradient(90deg,#1550E8,#5B8EF5,#1550E8)', backgroundSize:'200%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', display:'block', letterSpacing:-2, animation:'shimmer 3s linear infinite' }}>depa ideal.</span>
        </h1>
        <p style={{ fontFamily:'DM Sans', fontSize:17, color:'#6B6560', margin:'18px 0 32px', lineHeight:1.7, maxWidth:460 }}>
          Departamentos en preventa y venta, cuidadosamente seleccionados. Encuentra el tuyo en CDMX, Cancún, Los Cabos y más.
        </p>

        {/* Search bar */}
        <div style={{ background:'#fff', border:'1.5px solid rgba(21,80,232,0.15)', borderRadius:16, padding:6, boxShadow:'0 8px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ display:'flex', gap:2, marginBottom:6, padding:'0 6px' }}>
            {['Preventa','Venta','Ambos'].map(t=>(
              <button key={t} onClick={()=>setSearchType(t)} style={{ fontFamily:'DM Sans', fontSize:12, fontWeight:searchType===t?700:400, color:searchType===t?'#fff':'#9E9890', background:searchType===t?'#1550E8':'transparent', border:'none', borderRadius:100, padding:'5px 14px', cursor:'pointer', transition:'all 0.2s' }} data-cursor="pointer">{t}</button>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:10, background:'#F5F3EE', borderRadius:10, padding:'0 16px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1550E8" strokeWidth="2" opacity="0.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Colonia, ciudad o desarrollador..." style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:'DM Sans', fontSize:14, color:'#0E0E0C', padding:'13px 0', caretColor:'#1550E8' }} />
            </div>
            <button onClick={()=>setPage('listings')} style={{ background:'#1550E8', border:'none', borderRadius:10, padding:'13px 28px', fontFamily:'DM Sans', fontSize:14, fontWeight:700, color:'#fff', cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.25s', boxShadow:'0 4px 16px rgba(21,80,232,0.3)' }}
              onMouseEnter={e=>{e.target.style.background='#0B37C2';e.target.style.transform='scale(1.02)';}}
              onMouseLeave={e=>{e.target.style.background='#1550E8';e.target.style.transform='scale(1)';}}
              data-cursor="pointer">Buscar →</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:48, marginTop:36 }}>
          <HeroStat target={24} suffix="+" label="Proyectos" />
          <HeroStat target={6} label="Ciudades" />
          <HeroStat target={12} suffix="+" label="Desarrolladores" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <span style={{ fontFamily:'DM Sans', fontSize:10, color:'#9E9890', letterSpacing:3, textTransform:'uppercase' }}>Scroll</span>
        <div style={{ width:1, height:48, background:'linear-gradient(to bottom,rgba(21,80,232,0.5),transparent)', animation:'scrollLine 1.8s ease-in-out infinite' }} />
      </div>
    </section>
  );
};

// ── Variant 2: Grid Mosaic ────────────────────────────────────────────────────
const HeroGrid = ({ setPage, searchQuery, setSearchQuery, searchType, setSearchType }) => {
  const [hovered, setHovered] = React.useState(null);
  return (
    <section style={{ position:'relative', height:'100vh', overflow:'hidden', display:'grid', gridTemplateColumns:'1fr 1fr', background:'#F5F3EE' }}>
      {/* Right: Mosaic grid */}
      <div style={{ position:'absolute', right:0, top:0, width:'52%', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr 1fr', gap:3 }}>
        {PROPERTIES.slice(0,6).map((p,i)=>(
          <div key={p.id} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
            style={{ background:`linear-gradient(160deg,hsl(${p.accentHue},55%,88%),hsl(${p.accentHue},45%,78%))`, position:'relative', overflow:'hidden', cursor:'pointer',
              filter: hovered!==null&&hovered!==i?'brightness(0.75)':'brightness(1)', transition:'filter 0.3s' }} data-cursor="property">
            {Array.from({length:4}).map((_,r)=>Array.from({length:5}).map((_,c)=>(
              <div key={`${r}${c}`} style={{ position:'absolute', width:9, height:12, borderRadius:1, background:`hsla(${p.accentHue},50%,25%,${Math.random()>0.4?0.35:0.08})`, left:12+c*22, top:16+r*28 }} />
            )))}
            <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.85)', opacity:hovered===i?1:0, transition:'opacity 0.3s', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:18 }}>
              <div style={{ fontFamily:'DM Sans', fontSize:14, fontWeight:700, color:'#0E0E0C' }}>{p.name}</div>
              <div style={{ fontFamily:'DM Sans', fontSize:12, color:'#6B6560', marginTop:2 }}>{p.location}</div>
              <div style={{ fontFamily:'DM Sans', fontSize:18, color:'#1550E8', fontWeight:800, marginTop:5 }}>{p.priceStr}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position:'absolute', right:0, top:0, width:'52%', height:'100%', background:'linear-gradient(to right,#F5F3EE 0%,transparent 40%)', pointerEvents:'none', zIndex:1 }} />

      {/* Left content */}
      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 80px', background:'#F5F3EE' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(21,80,232,0.08)', border:'1px solid rgba(21,80,232,0.18)', borderRadius:100, padding:'7px 16px', marginBottom:24, width:'fit-content' }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#1550E8' }} />
          <span style={{ fontFamily:'DM Sans', fontSize:11, color:'#1550E8', letterSpacing:2, textTransform:'uppercase', fontWeight:600 }}>Marketplace de preventa</span>
        </div>
        <h1 style={{ fontFamily:'Playfair Display', fontSize:60, fontWeight:700, lineHeight:1.08, margin:'0 0 18px' }}>
          <span style={{ color:'#0E0E0C', display:'block' }}>Los mejores</span>
          <span style={{ color:'#1550E8', display:'block' }}>departamentos</span>
          <span style={{ color:'#0E0E0C', display:'block' }}>en un solo lugar.</span>
        </h1>
        <p style={{ fontFamily:'DM Sans', fontSize:16, color:'#6B6560', lineHeight:1.7, marginBottom:32, maxWidth:380 }}>Preventa, venta y renta en CDMX, Cancún, Los Cabos y más.</p>
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={()=>setPage('listings')} style={{ background:'#1550E8', border:'none', borderRadius:12, padding:'14px 28px', fontFamily:'DM Sans', fontSize:14, fontWeight:700, color:'#fff', cursor:'pointer', transition:'all 0.25s', boxShadow:'0 4px 16px rgba(21,80,232,0.3)' }}
            onMouseEnter={e=>{e.target.style.background='#0B37C2';e.target.style.transform='scale(1.04)';}}
            onMouseLeave={e=>{e.target.style.background='#1550E8';e.target.style.transform='scale(1)';}} data-cursor="pointer">Ver proyectos</button>
          <button onClick={()=>setPage('contact')} style={{ background:'transparent', border:'1.5px solid rgba(21,80,232,0.25)', borderRadius:12, padding:'14px 28px', fontFamily:'DM Sans', fontSize:14, fontWeight:500, color:'#1550E8', cursor:'pointer', transition:'all 0.25s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(21,80,232,0.06)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';}} data-cursor="pointer">Contactar asesor</button>
        </div>
      </div>
    </section>
  );
};

// ── Variant 3: Editorial ──────────────────────────────────────────────────────
const HeroEditorial = ({ setPage }) => {
  const [line, setLine] = React.useState(0);
  React.useEffect(()=>{ const iv=setInterval(()=>setLine(l=>(l+1)%3),2800); return()=>clearInterval(iv); },[]);
  const lines = ['PREVENTA','PLUSVALÍA','LIBERTAD'];
  const bgRef = useParallax(0.015);

  return (
    <section style={{ position:'relative', height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', background:'#F5F3EE' }}>
      <div ref={bgRef} style={{ position:'absolute', inset:'-10%', transition:'transform 0.08s linear' }}>
        <svg style={{ position:'absolute', inset:0, width:'110%', height:'110%', opacity:0.04 }}>
          {Array.from({length:20}).map((_,i)=>(
            <React.Fragment key={i}><line x1={`${i*6}%`} y1="0" x2={`${i*6}%`} y2="100%" stroke="#1550E8" strokeWidth="1"/><line x1="0" y1={`${i*6}%`} x2="100%" y2={`${i*6}%`} stroke="#1550E8" strokeWidth="1"/></React.Fragment>
          ))}
        </svg>
      </div>
      <div style={{ position:'relative', zIndex:2, padding:'0 40px' }}>
        <div style={{ fontFamily:'DM Sans', fontSize:12, letterSpacing:6, color:'rgba(21,80,232,0.5)', textTransform:'uppercase', marginBottom:28 }}>capitaldepas.com — México</div>
        <div style={{ fontFamily:'Playfair Display', fontSize:110, fontWeight:700, lineHeight:0.88, letterSpacing:-4, marginBottom:8 }}>
          <div style={{ color:'#0E0E0C', opacity:0.07 }}>INVIERTE</div>
          <div style={{ background:'linear-gradient(90deg,#1550E8,#5B8EF5,#1550E8)', backgroundSize:'200%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'shimmer 3s linear infinite', minHeight:120, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.5s ease' }}>{lines[line]}</div>
          <div style={{ color:'#0E0E0C', opacity:0.07 }}>EN MÉXICO</div>
        </div>
        <p style={{ fontFamily:'DM Sans', fontSize:18, color:'#9E9890', margin:'28px 0 36px', letterSpacing:0.3 }}>Departamentos en preventa y venta, cuidadosamente seleccionados.</p>
        <button onClick={()=>setPage('listings')} style={{ background:'#1550E8', border:'none', borderRadius:100, padding:'16px 44px', fontFamily:'DM Sans', fontSize:15, fontWeight:700, color:'#fff', cursor:'pointer', transition:'all 0.25s', boxShadow:'0 6px 24px rgba(21,80,232,0.35)', letterSpacing:0.3 }}
          onMouseEnter={e=>{e.target.style.background='#0B37C2';e.target.style.transform='scale(1.05)';}}
          onMouseLeave={e=>{e.target.style.background='#1550E8';e.target.style.transform='scale(1)';}} data-cursor="pointer">Explorar proyectos</button>
      </div>
    </section>
  );
};

const Hero = ({ variant='cinematic', setPage }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchType, setSearchType] = React.useState('Preventa');
  const props = { setPage, searchQuery, setSearchQuery, searchType, setSearchType };
  if(variant==='grid') return <HeroGrid {...props}/>;
  if(variant==='editorial') return <HeroEditorial setPage={setPage}/>;
  return <HeroCinematic {...props}/>;
};

Object.assign(window, { Hero });
