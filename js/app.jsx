
// ── capitaldepas.com · App Router + Tweaks (Light Theme) ────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "cinematic",
  "accentColor": "#1550E8",
  "showWhatsApp": true,
  "showFeatured": true
}/*EDITMODE-END*/;

const App = () => {
  const [page, setPage] = React.useState(()=>localStorage.getItem('capitaldepas_page')||'home');
  const [selectedProperty, setSelectedProperty] = React.useState(null);
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  // Re-renderizar cuando los datos de Google Sheets se hayan cargado
  useDataVersion();

  React.useEffect(()=>{ localStorage.setItem('capitaldepas_page',page); },[page]);

  React.useEffect(()=>{
    const handler = (e) => {
      if(e.data?.type==='__activate_edit_mode') setTweaksOpen(true);
      if(e.data?.type==='__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message',handler);
    window.parent.postMessage({type:'__edit_mode_available'},'*');
    return ()=>window.removeEventListener('message',handler);
  },[]);

  const updateTweak = (key,val) => {
    const next={...tweaks,[key]:val};
    setTweaks(next);
    window.parent.postMessage({type:'__edit_mode_set_keys',edits:{[key]:val}},'*');
  };

  const goTo = (p) => { setPage(p); window.scrollTo({top:0,behavior:'smooth'}); };

  const FeaturedSection = () => (
    <section style={{ background:'#F5F3EE', padding:'100px 60px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48 }}>
        <div>
          <div style={{ fontFamily:'DM Sans', fontSize:12, letterSpacing:4, color:'rgba(21,80,232,0.6)', textTransform:'uppercase', marginBottom:10 }}>Destacados</div>
          <h2 style={{ fontFamily:'Playfair Display', fontSize:48, fontWeight:700, color:'#0E0E0C', margin:0, letterSpacing:-1 }}>
            Proyectos <span style={{ color:'#1550E8' }}>destacados</span>
          </h2>
        </div>
        <button onClick={()=>goTo('listings')} style={{ background:'none', border:'1.5px solid rgba(21,80,232,0.2)', borderRadius:100, padding:'10px 24px', fontFamily:'DM Sans', fontSize:13, fontWeight:600, color:'#1550E8', cursor:'pointer', transition:'all 0.2s' }}
          onMouseEnter={e=>{e.target.style.background='rgba(21,80,232,0.06)';}}
          onMouseLeave={e=>{e.target.style.background='transparent';}}
          data-cursor="pointer">Ver todos →</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
        {PROPERTIES.slice(0,3).map(p=>(
          <PropertyCard key={p.id} prop={p} setPage={goTo} setSelectedProperty={setSelectedProperty}/>
        ))}
      </div>
    </section>
  );

  const HomePage = () => (
    <>
      <Hero variant={tweaks.heroVariant} setPage={goTo}/>
      <FeaturesBanner setPage={goTo}/>
      {tweaks.showFeatured && <FeaturedSection/>}
      <HowItWorks/>
      <MapSection setPage={goTo} setSelectedProperty={setSelectedProperty}/>
      <Calculator/>
      <Testimonials/>
      <Blog/>
      <Contact/>
      <Footer setPage={goTo}/>
    </>
  );

  return (
    <div style={{ background:'#F5F3EE', minHeight:'100vh', cursor:'none' }}>
      <Cursor/>
      <Nav currentPage={page} setPage={goTo}/>

      {page==='home'    && <HomePage/>}
      {page==='listings'&& <><Listings setPage={goTo} setSelectedProperty={setSelectedProperty}/><Footer setPage={goTo}/></>}
      {page==='project' && <><ProjectDetail prop={selectedProperty} setPage={goTo}/><Footer setPage={goTo}/></>}
      {page==='blog'    && <><div style={{paddingTop:80}}><Blog/></div><Footer setPage={goTo}/></>}
      {page==='map'     && <><div style={{paddingTop:80}}><MapSection setPage={goTo} setSelectedProperty={setSelectedProperty}/></div><Footer setPage={goTo}/></>}
      {page==='contact' && <><div style={{paddingTop:80}}><Contact/></div><Footer setPage={goTo}/></>}

      {tweaks.showWhatsApp && <WhatsAppFloat/>}

      {/* Tweaks Panel */}
      {tweaksOpen && (
        <div style={{ position:'fixed', bottom:100, right:24, zIndex:9999, background:'#fff', border:'1.5px solid rgba(21,80,232,0.15)', borderRadius:20, padding:'22px 22px 18px', width:272, boxShadow:'0 20px 60px rgba(0,0,0,0.12)' }}>
          <div style={{ fontFamily:'DM Sans', fontSize:11, letterSpacing:3, color:'rgba(21,80,232,0.5)', textTransform:'uppercase', marginBottom:18 }}>Tweaks</div>

          {/* Hero variant */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontFamily:'DM Sans', fontSize:12, color:'#9E9890', marginBottom:8 }}>Variante de hero</div>
            <div style={{ display:'flex', gap:6 }}>
              {['cinematic','grid','editorial'].map(v=>(
                <button key={v} onClick={()=>{updateTweak('heroVariant',v);goTo('home');}} style={{ flex:1, padding:'7px 4px', fontFamily:'DM Sans', fontSize:11, fontWeight:700, color:tweaks.heroVariant===v?'#fff':'#9E9890', background:tweaks.heroVariant===v?'#1550E8':'#F5F3EE', border:`1.5px solid ${tweaks.heroVariant===v?'#1550E8':'rgba(0,0,0,0.1)'}`, borderRadius:9, cursor:'pointer', transition:'all 0.2s', textTransform:'capitalize', boxShadow:tweaks.heroVariant===v?'0 4px 12px rgba(21,80,232,0.25)':'none' }} data-cursor="pointer">{v}</button>
              ))}
            </div>
          </div>

          {/* Show featured */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <span style={{ fontFamily:'DM Sans', fontSize:12, color:'#6B6560' }}>Sección destacada</span>
            <button onClick={()=>updateTweak('showFeatured',!tweaks.showFeatured)} style={{ width:44, height:24, borderRadius:100, padding:2, background:tweaks.showFeatured?'#1550E8':'rgba(0,0,0,0.1)', border:'none', cursor:'pointer', position:'relative', transition:'background 0.3s' }} data-cursor="pointer">
              <div style={{ width:20, height:20, borderRadius:'50%', background:'white', transition:'transform 0.3s', transform:tweaks.showFeatured?'translateX(20px)':'translateX(0)', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
            </button>
          </div>

          {/* WhatsApp toggle */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:'DM Sans', fontSize:12, color:'#6B6560' }}>Botón WhatsApp</span>
            <button onClick={()=>updateTweak('showWhatsApp',!tweaks.showWhatsApp)} style={{ width:44, height:24, borderRadius:100, padding:2, background:tweaks.showWhatsApp?'#25D366':'rgba(0,0,0,0.1)', border:'none', cursor:'pointer', position:'relative', transition:'background 0.3s' }} data-cursor="pointer">
              <div style={{ width:20, height:20, borderRadius:'50%', background:'white', transition:'transform 0.3s', transform:tweaks.showWhatsApp?'translateX(20px)':'translateX(0)', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
