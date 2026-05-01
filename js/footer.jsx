// ── capitaldepas.com · Footer (Light Theme, Mobile Responsive) ──────────────────────────
const Footer = ({ setPage }) => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);
  const waNumber = useWhatsAppNumber();
  const cols = [
    { title:'Explorar', links:[{label:'Todos los proyectos',page:'listings'},{label:'CDMX',page:'listings'},{label:'Cancún',page:'listings'},{label:'Los Cabos',page:'listings'},{label:'Mapa de proyectos',page:'map'}]},
    { title:'Empresa', links:[{label:'Nosotros',page:'home'},{label:'Blog',page:'blog'},{label:'Para desarrolladores',page:'contact'},{label:'Trabaja con nosotros',page:'contact'}]},
    { title:'Legal', links:[{label:'Términos y condiciones',page:'contact'},{label:'Aviso de privacidad',page:'contact'},{label:'Cookies',page:'contact'}]},
  ];
  return (
    <footer style={{ background:'#0E0E0C', padding:'60px 24px 32px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'-30%', left:'50%', transform:'translateX(-50%)', width:700, height:300, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(21,80,232,0.12),transparent 70%)', pointerEvents:'none' }} />
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:40, marginBottom:48, position:'relative' }}>
          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, cursor:'pointer' }} onClick={()=>setPage('home')} data-cursor="pointer">
              <div style={{ width:36, height:36, borderRadius:9, background:'#1550E8', position:'relative', overflow:'hidden', boxShadow:'0 4px 12px rgba(21,80,232,0.4)' }}>
                {[[5,6],[14,6],[5,13],[14,13],[5,20],[14,20],[5,27],[14,27]].map(([x,y],i)=>(<div key={i} style={{ position:'absolute', width:8, height:5, borderRadius:1, background:'rgba(255,255,255,0.85)', left:x, top:y }} />))}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'40%', background:'linear-gradient(to bottom,rgba(255,255,255,0.15),transparent)' }} />
              </div>
              <div style={{ fontFamily:'DM Sans', fontWeight:800, fontSize:22, letterSpacing:-0.8 }}>
                <span style={{ color:'#fff' }}>capital</span><span style={{ color:'#5B8EF5' }}>depas</span><span style={{ color:'rgba(91,142,245,0.4)', fontSize:13, fontWeight:500 }}>.com</span>
              </div>
            </div>
            <p style={{ fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.35)', lineHeight:1.75, maxWidth:270, marginBottom:28 }}>Departamentos en preventa y venta, cuidadosamente seleccionados. Proyectos verificados y asesoría personalizada.</p>
            <div style={{ marginBottom:28 }}>
              <div style={{ fontFamily:'DM Sans', fontSize:11, color:'rgba(255,255,255,0.35)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Newsletter</div>
              {subscribed ? (
                <div style={{ fontFamily:'DM Sans', fontSize:13, color:'#5B8EF5' }}>✓ ¡Gracias por suscribirte!</div>
              ) : (
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" style={{ flex:1, minWidth:140, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 14px', fontFamily:'DM Sans', fontSize:13, color:'#fff', outline:'none', caretColor:'#1550E8' }} onFocus={e=>e.target.style.borderColor='rgba(91,142,245,0.5)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
                  <button onClick={()=>email&&setSubscribed(true)} style={{ background:'#1550E8', border:'none', borderRadius:10, padding:'10px 16px', fontFamily:'DM Sans', fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }} data-cursor="pointer">Suscribir</button>
                </div>
              )}
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {[{url:'https://instagram.com',l:'IG',c:'#E1306C'},{url:'https://facebook.com',l:'FB',c:'#1877F2'},{url:'https://tiktok.com',l:'TK',c:'#ff0050'},{url:'https://linkedin.com',l:'LI',c:'#0A66C2'},{url:'https://wa.me/'+waNumber,l:'WA',c:'#25D366'}].filter(s=>s.l!=='WA'||waNumber).map(s=>(
                <a key={s.l} href={s.url} target="_blank" rel="noreferrer" style={{ width:36, height:36, borderRadius:9, background:`${s.c}18`, border:`1px solid ${s.c}35`, display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:700, color:s.c, transition:'all 0.2s' }} onMouseEnter={e=>{e.currentTarget.style.background=`${s.c}30`;e.currentTarget.style.transform='translateY(-2px)';}} onMouseLeave={e=>{e.currentTarget.style.background=`${s.c}18`;e.currentTarget.style.transform='none';}} data-cursor="pointer">{s.l}</a>
              ))}
            </div>
          </div>
          {/* Link columns */}
          {cols.map(col=>(
            <div key={col.title}>
              <div style={{ fontFamily:'DM Sans', fontSize:11, letterSpacing:2.5, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:18 }}>{col.title}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {col.links.map(l=>(
                  <button key={l.label} onClick={()=>setPage(l.page)} style={{ background:'none', border:'none', padding:0, fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.45)', cursor:'pointer', textAlign:'left', transition:'color 0.2s' }} onMouseEnter={e=>e.target.style.color='#5B8EF5'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.45)'} data-cursor="pointer">{l.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Bottom bar */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:24, display:'flex', flexWrap:'wrap', gap:12, justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:'DM Sans', fontSize:12, color:'rgba(255,255,255,0.2)' }}>© 2026 capitaldepas.com · Todos los derechos reservados</div>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80' }} />
            <span style={{ fontFamily:'DM Sans', fontSize:11, color:'rgba(255,255,255,0.2)' }}>Todos los sistemas operativos</span>
          </div>
          <div style={{ fontFamily:'DM Sans', fontSize:12, color:'rgba(255,255,255,0.2)' }}>Hecho con ♥ en México</div>
        </div>
      </div>
    </footer>
  );
};

const WhatsAppFloat = () => {
  const [hovered, setHovered] = React.useState(false);
  const magRef = useMagnetic(0.4);
  const waNumber = useWhatsAppNumber();
  if (!waNumber) return null;
  return (
    <a ref={magRef} href={"https://wa.me/"+waNumber+"?text=Hola, me interesa información sobre departamentos en capitaldepas.com"} target="_blank" rel="noreferrer" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} style={{ position:'fixed', bottom:32, right:32, zIndex:500, width:56, height:56, borderRadius:'50%', background:hovered?'#1da851':'#25D366', boxShadow:hovered?'0 8px 32px rgba(37,211,102,0.5)':'0 4px 20px rgba(37,211,102,0.35)', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', transition:'all 0.3s', transform:hovered?'scale(1.1)':'scale(1)' }} data-cursor="pointer">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  );
};
Object.assign(window, { Footer, WhatsAppFloat });
