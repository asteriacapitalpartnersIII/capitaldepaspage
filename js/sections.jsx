
// ── capitaldepas.com · Sections: HowItWorks + Testimonials + Features (Light) ───────

const HowItWorks = () => {
  const steps = [
    { n:'01', title:'Explora proyectos', desc:'Navega cientos de departamentos en preventa y venta. Filtra por zona, precio, tipo y más.', icon:'🔍' },
    { n:'02', title:'Compara y elige', desc:'Revisa amenidades, desarrollador, ubicación y plazos de entrega. Usa nuestra calculadora de crédito.', icon:'⚖️' },
    { n:'03', title:'Agenda una visita', desc:'Conecta con un asesor certificado y agenda una cita en persona o virtual.', icon:'📅' },
    { n:'04', title:'Cierra tu depa', desc:'Te acompañamos en todo el proceso legal y de financiamiento hasta recibir tus llaves.', icon:'🗝️' },
  ];
  const [ref, vis] = useScrollReveal(0.1);

  return (
    <section style={{ background:'#fff', padding:'100px 60px', position:'relative', overflow:'hidden' }}>
      {/* Decorative blue blob */}
      <div style={{ position:'absolute', top:'50%', right:'-5%', transform:'translateY(-50%)', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(21,80,232,0.06),transparent 70%)', pointerEvents:'none' }} />

      <div ref={ref} style={{ opacity:vis?1:0, transform:vis?'none':'translateY(40px)', transition:'all 0.9s ease' }}>
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <div style={{ fontFamily:'DM Sans', fontSize:12, letterSpacing:4, color:'rgba(21,80,232,0.6)', textTransform:'uppercase', marginBottom:12 }}>El proceso</div>
          <h2 style={{ fontFamily:'Playfair Display', fontSize:48, fontWeight:700, color:'#0E0E0C', margin:0, letterSpacing:-1 }}>
            ¿Cómo <span style={{ color:'#1550E8' }}>funciona</span>?
          </h2>
          <p style={{ fontFamily:'DM Sans', fontSize:16, color:'#9E9890', margin:'14px auto 0', maxWidth:460 }}>En cuatro simples pasos, te ayudamos a encontrar y comprar el departamento de tus sueños.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, position:'relative' }}>
          {/* Connecting line */}
          <div style={{ position:'absolute', top:52, left:'12.5%', right:'12.5%', height:1, background:'linear-gradient(90deg,rgba(21,80,232,0.2),rgba(21,80,232,0.05),rgba(21,80,232,0.2))', pointerEvents:'none', zIndex:0 }} />

          {steps.map((s,i) => {
            const [sRef, sVis] = useScrollReveal(0.1);
            return (
              <div key={s.n} ref={sRef} style={{ opacity:sVis?1:0, transform:sVis?'none':`translateY(${20+i*8}px)`, transition:`all 0.8s ${i*0.12}s ease`, textAlign:'center', position:'relative', zIndex:1 }}>
                <div style={{ width:104, height:104, borderRadius:'50%', margin:'0 auto 24px', background:'#F5F3EE', border:'2px solid rgba(21,80,232,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', boxShadow:'0 4px 20px rgba(21,80,232,0.07)', transition:'all 0.3s' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='#1550E8';e.currentTarget.style.background='rgba(21,80,232,0.06)';e.currentTarget.style.boxShadow='0 8px 30px rgba(21,80,232,0.15)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(21,80,232,0.15)';e.currentTarget.style.background='#F5F3EE';e.currentTarget.style.boxShadow='0 4px 20px rgba(21,80,232,0.07)';}}
                  data-cursor="pointer">
                  <span style={{ fontSize:28 }}>{s.icon}</span>
                  <span style={{ fontFamily:'DM Sans', fontSize:10, color:'rgba(21,80,232,0.5)', letterSpacing:2, textTransform:'uppercase', marginTop:4, fontWeight:700 }}>{s.n}</span>
                </div>
                <h3 style={{ fontFamily:'DM Sans', fontSize:16, fontWeight:700, color:'#0E0E0C', marginBottom:10 }}>{s.title}</h3>
                <p style={{ fontFamily:'DM Sans', fontSize:13, color:'#9E9890', lineHeight:1.7, maxWidth:200, margin:'0 auto' }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const [active, setActive] = React.useState(0);
  const [ref, vis] = useScrollReveal(0.1);

  React.useEffect(()=>{ const iv=setInterval(()=>setActive(a=>(a+1)%TESTIMONIALS.length),5000); return()=>clearInterval(iv); },[]);

  return (
    <section style={{ background:'#F5F3EE', padding:'100px 60px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:400, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(21,80,232,0.04),transparent 70%)', pointerEvents:'none' }} />

      <div ref={ref} style={{ opacity:vis?1:0, transform:vis?'none':'translateY(40px)', transition:'all 0.9s ease' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontFamily:'DM Sans', fontSize:12, letterSpacing:4, color:'rgba(21,80,232,0.6)', textTransform:'uppercase', marginBottom:12 }}>Testimonios</div>
          <h2 style={{ fontFamily:'Playfair Display', fontSize:48, fontWeight:700, color:'#0E0E0C', margin:0, letterSpacing:-1 }}>
            Lo que dicen <span style={{ color:'#1550E8' }}>nuestros clientes</span>
          </h2>
        </div>

        <div style={{ position:'relative', maxWidth:900, margin:'0 auto', overflow:'hidden' }}>
          <div style={{ display:'flex', gap:24, transition:'transform 0.6s cubic-bezier(.23,1,.32,1)', transform:`translateX(calc(-${active*50}% - ${active*12}px))` }}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={t.id} style={{ minWidth:'calc(50% - 12px)', background:i===active?'#fff':'rgba(255,255,255,0.5)', border:`1.5px solid ${i===active?'rgba(21,80,232,0.25)':'rgba(0,0,0,0.05)'}`, borderRadius:20, padding:'32px 36px', transition:'all 0.4s', transform:i===active?'scale(1.02)':'scale(0.98)', boxShadow:i===active?'0 12px 40px rgba(21,80,232,0.1)':'none' }}>
                <div style={{ display:'flex', gap:3, marginBottom:18 }}>
                  {Array.from({length:t.stars}).map((_,j)=>(
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#1550E8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p style={{ fontFamily:'DM Sans', fontSize:15, color:'#3A3835', lineHeight:1.75, marginBottom:22, fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:`linear-gradient(135deg,hsl(${210+t.id*40},60%,80%),hsl(${210+t.id*40},50%,70%))`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Sans', fontSize:14, fontWeight:800, color:'#fff', flexShrink:0 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontFamily:'DM Sans', fontSize:14, fontWeight:700, color:'#0E0E0C' }}>{t.name}</div>
                    <div style={{ fontFamily:'DM Sans', fontSize:12, color:'#9E9890', marginTop:2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:32 }}>
            {TESTIMONIALS.map((_,i)=>(
              <button key={i} onClick={()=>setActive(i)} style={{ width:i===active?28:8, height:8, borderRadius:100, background:i===active?'#1550E8':'rgba(21,80,232,0.2)', border:'none', cursor:'pointer', transition:'all 0.3s', padding:0 }} data-cursor="pointer"/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesBanner = ({ setPage }) => {
  const features = [
    { icon:'🔒', title:'Proyectos verificados', desc:'Cada desarrollador es auditado antes de publicar en nuestra plataforma.' },
    { icon:'👥', title:'Asesores certificados', desc:'Expertos inmobiliarios disponibles en todo el proceso de compra.' },
    { icon:'📊', title:'Transparencia total', desc:'Precios, planos, avances de obra y contratos a la vista.' },
    { icon:'💰', title:'Mejor precio garantizado', desc:'En preventa, hasta 20% por debajo del valor final de mercado.' },
  ];
  const [ref, vis] = useScrollReveal(0.1);

  return (
    <section style={{ background:'#EEF2FF', borderTop:'1px solid rgba(21,80,232,0.1)', borderBottom:'1px solid rgba(21,80,232,0.1)', padding:'72px 60px' }}>
      <div ref={ref} style={{ opacity:vis?1:0, transition:'all 0.8s ease' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32 }}>
          {features.map((f,i)=>{
            const [fRef, fVis] = useScrollReveal(0.1);
            return (
              <div key={f.title} ref={fRef} style={{ opacity:fVis?1:0, transform:fVis?'none':'translateY(20px)', transition:`all 0.7s ${i*0.1}s ease`, display:'flex', gap:16, alignItems:'flex-start' }}>
                <div style={{ fontSize:28, flexShrink:0, width:48, height:48, borderRadius:12, background:'rgba(21,80,232,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily:'DM Sans', fontSize:14, fontWeight:700, color:'#0E0E0C', marginBottom:5 }}>{f.title}</div>
                  <div style={{ fontFamily:'DM Sans', fontSize:13, color:'#6B6560', lineHeight:1.6 }}>{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { HowItWorks, Testimonials, FeaturesBanner });
