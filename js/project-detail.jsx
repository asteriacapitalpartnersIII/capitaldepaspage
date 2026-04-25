
// ── capitaldepas.com · Project Detail (Light Theme) ──────────────────────────────────

const ProjectDetail = ({ prop, setPage }) => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [activeImg, setActiveImg] = React.useState(0);
  const magBtn = useMagnetic(0.3);
  const [ref, vis] = useScrollReveal(0.05);

  if (!prop) return null;

  const tabs = ['overview','amenidades','ubicación','financiamiento'];
  const tabLabel = { overview:'Descripción', amenidades:'Amenidades', ubicación:'Ubicación', financiamiento:'Financiamiento' };
  const realPhotos = prop.photos && prop.photos.length > 0;
  const mockImages = realPhotos
    ? prop.photos.map((url, i) => ({ url, label:`Foto ${i+1}` }))
    : Array.from({length:4}).map((_,i) => ({ hue:prop.accentHue+i*20, label:['Fachada','Interior','Roof Garden','Lobby'][i] }));

  const tabStyle = (active) => ({
    fontFamily:'DM Sans', fontSize:13, fontWeight:active?700:500,
    color:active?'#1550E8':'#9E9890', background:'none', border:'none',
    borderBottom:`2px solid ${active?'#1550E8':'transparent'}`,
    padding:'12px 0', cursor:'pointer', transition:'all 0.2s', letterSpacing:0.2,
  });

  return (
    <div style={{ minHeight:'100vh', background:'#F5F3EE', paddingTop:80 }}>
      {/* Back */}
      <div style={{ padding:'20px 60px 0' }}>
        <button onClick={()=>setPage('listings')} style={{ background:'#fff', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:100, padding:'8px 20px', fontFamily:'DM Sans', fontSize:12, fontWeight:600, color:'#6B6560', cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all 0.2s', boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='#1550E8';e.currentTarget.style.color='#1550E8';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(0,0,0,0.1)';e.currentTarget.style.color='#6B6560';}}
          data-cursor="pointer">← Volver a proyectos</button>
      </div>

      <div ref={ref} style={{ opacity:vis?1:0, transform:vis?'none':'translateY(20px)', transition:'all 0.7s ease', padding:'28px 60px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:44 }}>
          {/* Left */}
          <div>
            {/* Gallery */}
            <div style={{ borderRadius:20, overflow:'hidden', marginBottom:12, height:400, position:'relative', background: mockImages[activeImg].url ? `url(${mockImages[activeImg].url}) center/cover` : `linear-gradient(160deg,hsl(${mockImages[activeImg].hue},55%,86%),hsl(${mockImages[activeImg].hue},40%,76%))`, boxShadow:'0 8px 40px rgba(0,0,0,0.1)' }}>
              {!mockImages[activeImg].url && Array.from({length:6}).map((_,r)=>Array.from({length:9}).map((_,c)=>(
                <div key={`${r}${c}`} style={{ position:'absolute', width:14, height:18, borderRadius:2, background:`hsla(${mockImages[activeImg].hue},50%,25%,${Math.random()>0.4?0.3:0.06})`, left:20+c*34, top:24+r*56 }} />
              )))}
              <div style={{ position:'absolute', bottom:18, left:18, background:'rgba(255,255,255,0.9)', borderRadius:8, padding:'5px 12px', backdropFilter:'blur(8px)' }}>
                <span style={{ fontFamily:'DM Sans', fontSize:11, color:'#6B6560', letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>{mockImages[activeImg].label}</span>
              </div>
              <div style={{ position:'absolute', top:18, right:18, background:'rgba(255,255,255,0.9)', borderRadius:8, padding:'4px 12px', backdropFilter:'blur(8px)' }}>
                <span style={{ fontFamily:'DM Sans', fontSize:11, color:'#9E9890' }}>{activeImg+1}/{mockImages.length}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginBottom:28 }}>
              {mockImages.map((img,i)=>(
                <div key={i} onClick={()=>setActiveImg(i)} style={{ width:80, height:60, borderRadius:10, overflow:'hidden', cursor:'pointer', background: img.url ? `url(${img.url}) center/cover` : `linear-gradient(135deg,hsl(${img.hue},55%,86%),hsl(${img.hue},40%,76%))`, border:`2px solid ${activeImg===i?'#1550E8':'transparent'}`, opacity:activeImg===i?1:0.55, transition:'all 0.2s', boxShadow:activeImg===i?'0 4px 12px rgba(21,80,232,0.2)':'none' }} data-cursor="pointer"/>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display:'flex', gap:28, borderBottom:'1.5px solid rgba(0,0,0,0.08)' }}>
              {tabs.map(t=><button key={t} onClick={()=>setActiveTab(t)} style={tabStyle(activeTab===t)} data-cursor="pointer">{tabLabel[t]}</button>)}
            </div>

            <div style={{ paddingTop:26 }}>
              {activeTab==='overview' && (
                <div>
                  <p style={{ fontFamily:'DM Sans', fontSize:16, color:'#6B6560', lineHeight:1.8, marginBottom:24 }}>{prop.desc}</p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
                    {[{label:'Recámaras',val:prop.beds},{label:'Baños',val:prop.baths},{label:'Superficie',val:`${prop.sqm} m²`},{label:'Entrega',val:prop.completion},{label:'Tipo',val:prop.type},{label:'Desarrollador',val:prop.developer}].map(item=>(
                      <div key={item.label} style={{ background:'#fff', border:'1.5px solid rgba(0,0,0,0.07)', borderRadius:12, padding:'14px 16px', boxShadow:'0 1px 6px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontFamily:'DM Sans', fontSize:11, color:'#9E9890', letterSpacing:1, textTransform:'uppercase', marginBottom:5 }}>{item.label}</div>
                        <div style={{ fontFamily:'DM Sans', fontSize:16, color:'#0E0E0C', fontWeight:700 }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab==='amenidades' && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
                  {prop.amenities.map(a=>(
                    <div key={a} style={{ display:'flex', alignItems:'center', gap:12, background:'#fff', border:'1.5px solid rgba(0,0,0,0.07)', borderRadius:12, padding:'13px 16px', boxShadow:'0 1px 6px rgba(0,0,0,0.04)' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:'#1550E8', flexShrink:0 }} />
                      <span style={{ fontFamily:'DM Sans', fontSize:14, color:'#3A3835' }}>{a}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab==='ubicación' && (
              <div>
                <MiniMapa prop={prop} height={340} />
                <div style={{ fontFamily:'DM Sans', fontSize:14, color:'#6B6560', lineHeight:1.75, marginTop:18 }}>
                  Ubicado en <strong style={{color:'#0E0E0C'}}>{prop.location}</strong>. {prop.hasCoords ? 'Acerca el mapa para ver el punto exacto del desarrollo.' : 'Aún no tenemos coordenadas precisas para este desarrollo.'}
                </div>
              </div>
            )}
            {activeTab==='financiamiento' && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  {[{title:'Crédito Bancario',icon:'🏦',desc:'BBVA, Santander, HSBC, Banorte. Hasta 90% del valor a 20 años.'},{title:'Infonavit',icon:'🏠',desc:'Compatible con Infonavit directo o cofinavit con banco.'},{title:'Preventa con descuento',icon:'📉',desc:'Hasta 15% de descuento sobre precio de lista comprando en preventa.'},{title:'Financiamiento propio',icon:'📋',desc:'El desarrollador ofrece esquemas de pago a meses sin intereses.'}].map(item=>(
                    <div key={item.title} style={{ background:'#fff', border:'1.5px solid rgba(0,0,0,0.07)', borderRadius:14, padding:'18px', boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}>
                      <div style={{fontSize:26,marginBottom:10}}>{item.icon}</div>
                      <div style={{fontFamily:'DM Sans',fontSize:14,fontWeight:700,color:'#0E0E0C',marginBottom:5}}>{item.title}</div>
                      <div style={{fontFamily:'DM Sans',fontSize:12,color:'#9E9890',lineHeight:1.6}}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: sticky panel */}
          <div style={{ position:'sticky', top:100, alignSelf:'start' }}>
            <div style={{ background:'#fff', border:'1.5px solid rgba(0,0,0,0.08)', borderRadius:22, padding:26, boxShadow:'0 8px 40px rgba(0,0,0,0.08)' }}>
              <div style={{ display:'inline-block', background:'rgba(21,80,232,0.1)', color:'#1550E8', fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', padding:'4px 12px', borderRadius:100, marginBottom:10 }}>{prop.type}</div>
              <div style={{ fontFamily:'DM Sans', fontSize:32, fontWeight:800, color:'#1550E8', marginBottom:2 }}>{prop.priceStr}</div>
              <div style={{ fontFamily:'DM Sans', fontSize:13, color:'#9E9890', marginBottom:20 }}>{prop.name} · {prop.location}</div>

              <div style={{ display:'flex', gap:0, marginBottom:20, padding:'16px 0', borderTop:'1px solid rgba(0,0,0,0.06)', borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
                {[{v:prop.beds,l:'Rec.'},{v:prop.baths,l:'Baños'},{v:prop.sqm+'m²',l:'Área'}].map((item,i)=>(
                  <div key={item.l} style={{ flex:1, textAlign:'center', borderRight:i<2?'1px solid rgba(0,0,0,0.06)':'none' }}>
                    <div style={{ fontFamily:'DM Sans', fontSize:22, color:'#0E0E0C', fontWeight:800 }}>{item.v}</div>
                    <div style={{ fontFamily:'DM Sans', fontSize:11, color:'#9E9890', marginTop:3, textTransform:'uppercase', letterSpacing:1 }}>{item.l}</div>
                  </div>
                ))}
              </div>

              <button ref={magBtn} onClick={()=>setPage('contact')} style={{ width:'100%', background:'#1550E8', border:'none', borderRadius:12, padding:'14px', fontFamily:'DM Sans', fontSize:15, fontWeight:700, color:'#fff', cursor:'pointer', marginBottom:10, transition:'all 0.25s', boxShadow:'0 4px 16px rgba(21,80,232,0.3)', letterSpacing:0.3 }}
                onMouseEnter={e=>{e.target.style.background='#0B37C2';e.target.style.transform='scale(1.02)';}}
                onMouseLeave={e=>{e.target.style.background='#1550E8';e.target.style.transform='scale(1)';}}
                data-cursor="pointer">Solicitar información</button>

              <a href={"https://wa.me/525512345678?text="+encodeURIComponent("Hola, me interesa el proyecto "+prop.name)} target="_blank" rel="noreferrer"
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10, background:'rgba(37,211,102,0.1)', border:'1.5px solid rgba(37,211,102,0.25)', borderRadius:12, padding:'12px', fontFamily:'DM Sans', fontSize:14, fontWeight:700, color:'#16a34a', cursor:'pointer', textDecoration:'none', transition:'all 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(37,211,102,0.18)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(37,211,102,0.1)'}
                data-cursor="pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chatear por WhatsApp
              </a>

              <div style={{ marginTop:18, display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80', flexShrink:0 }} />
                <span style={{ fontFamily:'DM Sans', fontSize:12, color:'#9E9890' }}>Asesor disponible ahora</span>
              </div>
            </div>

            {/* Developer badge */}
            <div style={{ background:'#fff', border:'1.5px solid rgba(0,0,0,0.07)', borderRadius:14, padding:'14px 18px', marginTop:12, display:'flex', alignItems:'center', gap:14, boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ width:44, height:44, borderRadius:10, background:`linear-gradient(135deg,hsl(${prop.accentHue},55%,85%),hsl(${prop.accentHue},45%,75%))`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Sans', fontSize:16, fontWeight:800, color:'#fff', flexShrink:0 }}>{prop.developer.charAt(0)}</div>
              <div>
                <div style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:700, color:'#0E0E0C' }}>{prop.developer}</div>
                <div style={{ fontFamily:'DM Sans', fontSize:11, color:'#1550E8', marginTop:2, fontWeight:600 }}>Desarrollador verificado ✓</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ProjectDetail });
