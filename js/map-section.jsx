
// ── capitaldepas.com · Mexico Map (Proper SVG + Light Theme) ────────────────────────

const MapSection = ({ setPage, setSelectedProperty }) => {
  const [activeZone, setActiveZone] = React.useState(null);
  const [ref, vis] = useScrollReveal(0.05);

  const zones = [
    { id:'cdmx',      label:'Ciudad de México', x:40,  y:40,  count:4, color:'#1550E8' },
    { id:'cancun',    label:'Cancún',            x:80,  y:30,  count:1, color:'#0891b2' },
    { id:'cabos',     label:'Los Cabos',         x:8,   y:53,  count:1, color:'#7c3aed' },
    { id:'oaxaca',    label:'Pto. Escondido',    x:50,  y:50,  count:1, color:'#16a34a' },
    { id:'guadalajara',label:'Guadalajara',      x:28,  y:36,  count:0, color:'#ea580c' },
    { id:'monterrey', label:'Monterrey',         x:53,  y:21,  count:0, color:'#dc2626' },
  ];

  const activeProps = PROPERTIES.filter(p => p.zone === activeZone);

  return (
    <section style={{ background:'#F5F3EE', padding:'100px 0', overflow:'hidden' }}>
      <div ref={ref} style={{ opacity:vis?1:0, transform:vis?'none':'translateY(40px)', transition:'all 0.9s ease' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:56, padding:'0 60px' }}>
          <div style={{ fontFamily:'DM Sans', fontSize:12, letterSpacing:4, color:'rgba(21,80,232,0.6)', textTransform:'uppercase', marginBottom:12 }}>Cobertura Nacional</div>
          <h2 style={{ fontFamily:'Playfair Display', fontSize:48, fontWeight:700, color:'#0E0E0C', margin:0, letterSpacing:-1 }}>
            Proyectos en todo <span style={{ color:'#1550E8' }}>México</span>
          </h2>
          <p style={{ fontFamily:'DM Sans', fontSize:16, color:'#9E9890', marginTop:12 }}>Haz clic en una ciudad para explorar sus proyectos disponibles.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', alignItems:'center' }}>
          {/* Mexico SVG Map */}
          <div style={{ padding:'0 40px 0 60px' }}>
            <svg viewBox="0 0 100 70" style={{ width:'100%', maxWidth:680, display:'block', margin:'0 auto', filter:'drop-shadow(0 8px 24px rgba(21,80,232,0.08))' }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="mapGlow">
                  <feGaussianBlur stdDeviation="1" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <linearGradient id="mexicoFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EEF2FF"/>
                  <stop offset="100%" stopColor="#DBEAFE"/>
                </linearGradient>
              </defs>

              {/* ── Mexico main body ── */}
              <path d="
                M 18,21
                L 22,18 L 30,15 L 40,13 L 52,11 L 62,11 L 70,12
                L 74,16 L 77,22 L 79,29 L 78,35
                L 82,33 L 85,26 L 83,21 L 80,24 L 78,30
                L 76,37 L 71,43 L 66,47 L 60,51 L 54,53
                L 47,53 L 41,51 L 35,49 L 28,46
                L 22,43 L 18,38 L 17,30 Z"
                fill="url(#mexicoFill)" stroke="#1550E8" strokeWidth="0.6" strokeOpacity="0.35"/>

              {/* ── Baja California peninsula ── */}
              <path d="
                M 18,21 L 16,25 L 14,31 L 11,38 L 9,45 L 7,52 L 6,57
                L 8,57 L 9,53 L 11,46 L 13,39 L 15,33 L 17,26 Z"
                fill="url(#mexicoFill)" stroke="#1550E8" strokeWidth="0.6" strokeOpacity="0.35"/>

              {/* ── Interior state lines (subtle) ── */}
              {[
                "M 30,15 L 28,46", // Sinaloa/Durango line
                "M 52,11 L 54,53", // Tamaulipas/Veracruz divide
                "M 62,11 L 66,47", // right side
                "M 40,13 L 41,51", // CDMX corridor
              ].map((d,i)=>(
                <path key={i} d={d} fill="none" stroke="#1550E8" strokeWidth="0.2" strokeOpacity="0.12" strokeDasharray="1,2"/>
              ))}

              {/* ── Water labels ── */}
              <text x="72" y="18" style={{ fontFamily:'DM Sans', fontSize:'3px', fill:'#1550E8', opacity:0.25, fontStyle:'italic' }}>Golfo de México</text>
              <text x="4" y="35" style={{ fontFamily:'DM Sans', fontSize:'2.5px', fill:'#1550E8', opacity:0.2, fontStyle:'italic' }}>Pacífico</text>
              <text x="86" y="40" style={{ fontFamily:'DM Sans', fontSize:'2.5px', fill:'#1550E8', opacity:0.2, fontStyle:'italic' }}>Mar Caribe</text>

              {/* ── City markers ── */}
              {zones.map(z => {
                const isActive = activeZone === z.id;
                const hasProps = z.count > 0;
                return (
                  <g key={z.id} onClick={() => hasProps ? setActiveZone(z.id===activeZone?null:z.id) : null}
                    style={{ cursor:hasProps?'pointer':'default' }} data-cursor={hasProps?"pointer":undefined}>

                    {/* Pulse rings for active cities */}
                    {hasProps && (
                      <>
                        <circle cx={z.x} cy={z.y} r="5" fill="none" stroke={z.color} strokeWidth="0.5" opacity="0.3">
                          <animate attributeName="r" values="3;8;3" dur="2.5s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx={z.x} cy={z.y} r="3" fill="none" stroke={z.color} strokeWidth="0.5" opacity="0.5">
                          <animate attributeName="r" values="2;5;2" dur="2.5s" begin="0.4s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" begin="0.4s" repeatCount="indefinite"/>
                        </circle>
                      </>
                    )}

                    {/* Main dot */}
                    <circle cx={z.x} cy={z.y}
                      r={isActive?4.5 : hasProps?3:2}
                      fill={hasProps?z.color:'rgba(21,80,232,0.2)'}
                      stroke="#fff" strokeWidth={isActive?1.5:1}
                      filter={isActive?'url(#mapGlow)':undefined}
                      style={{ transition:'r 0.3s' }}/>

                    {/* Label */}
                    <text x={z.x} y={z.y-5.5} textAnchor="middle"
                      style={{ fontFamily:'DM Sans', fontSize:'2.8px', fill:hasProps?z.color:'#9E9890', fontWeight:isActive?'700':'500' }}>
                      {z.label}
                    </text>
                    {hasProps && (
                      <text x={z.x} y={z.y+7} textAnchor="middle"
                        style={{ fontFamily:'DM Sans', fontSize:'2.3px', fill:'#6B6560' }}>
                        {z.count} proy.
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div style={{ display:'flex', justifyContent:'center', gap:20, marginTop:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:'DM Sans', fontSize:12, color:'#9E9890' }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#1550E8' }} /> Proyectos disponibles
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:'DM Sans', fontSize:12, color:'#9E9890' }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'rgba(21,80,232,0.2)' }} /> Próximamente
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ padding:'0 56px 0 0' }}>
            {!activeZone ? (
              <div style={{ textAlign:'center', padding:'40px 20px', background:'#fff', borderRadius:20, border:'1.5px dashed rgba(21,80,232,0.15)' }}>
                <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(21,80,232,0.08)', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>📍</div>
                <div style={{ fontFamily:'DM Sans', fontSize:14, color:'#9E9890' }}>Selecciona una ciudad en el mapa</div>
              </div>
            ) : (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                  <div>
                    <div style={{ fontFamily:'DM Sans', fontSize:11, letterSpacing:3, color:'rgba(21,80,232,0.5)', textTransform:'uppercase', marginBottom:4 }}>Proyectos en</div>
                    <div style={{ fontFamily:'Playfair Display', fontSize:22, color:'#0E0E0C', fontWeight:700 }}>{zones.find(z=>z.id===activeZone)?.label}</div>
                  </div>
                  <button onClick={()=>setActiveZone(null)} style={{ background:'none', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', color:'#6B6560' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#1550E8';e.currentTarget.style.color='#1550E8';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(0,0,0,0.1)';e.currentTarget.style.color='#6B6560';}}
                  >×</button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {activeProps.map(p=>(
                    <div key={p.id} onClick={()=>{setSelectedProperty(p);setPage('project');window.scrollTo(0,0);}}
                      style={{ background:'#fff', border:'1.5px solid rgba(0,0,0,0.06)', borderRadius:14, padding:'14px 16px', cursor:'pointer', transition:'all 0.2s', display:'flex', gap:14 }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(21,80,232,0.3)';e.currentTarget.style.boxShadow='0 4px 20px rgba(21,80,232,0.1)';}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(0,0,0,0.06)';e.currentTarget.style.boxShadow='none';}}
                      data-cursor="property">
                      <div style={{ width:48, height:48, borderRadius:10, background:`linear-gradient(135deg,hsl(${p.accentHue},55%,85%),hsl(${p.accentHue},45%,75%))`, flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:700, color:'#0E0E0C' }}>{p.name}</div>
                        <div style={{ fontFamily:'DM Sans', fontSize:11, color:'#9E9890', marginTop:2 }}>{p.location}</div>
                        <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
                          <span style={{ fontFamily:'DM Sans', fontSize:15, color:'#1550E8', fontWeight:800 }}>{p.priceStr}</span>
                          <span style={{ fontFamily:'DM Sans', fontSize:10, color:'#1550E8', background:'rgba(21,80,232,0.08)', padding:'2px 8px', borderRadius:100 }}>{p.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setPage('listings')} style={{ width:'100%', marginTop:14, background:'#1550E8', border:'none', borderRadius:12, padding:'12px', fontFamily:'DM Sans', fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer', transition:'all 0.2s', boxShadow:'0 4px 12px rgba(21,80,232,0.25)' }}
                  onMouseEnter={e=>{e.target.style.background='#0B37C2';}}
                  onMouseLeave={e=>{e.target.style.background='#1550E8';}}
                  data-cursor="pointer">Ver todos los proyectos →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { MapSection });
