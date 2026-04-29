
// ── capitaldepas.com · Contact + FAQ + Privacy (Light Theme) ────────────────────────

const Contact = () => {
  const [form, setForm] = React.useState({ name:'', email:'', phone:'', zone:'', message:'', privacy:false });
  const [sent, setSent] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState(null);
  const [showPrivacy, setShowPrivacy] = React.useState(false);
  const [ref, vis] = useScrollReveal(0.05); const waNumber = useWhatsAppNumber();

  const update = (k,v) => setForm(f=>({...f,[k]:v}));
  const submit = (e) => { e.preventDefault(); if(form.privacy) (function(){try{window.capdepasTrack && window.capdepasTrack("lead", { source:"contact_form" });}catch(e){}})(); setSent(true); };

  const inp = {
    width:'100%', background:'#fff', border:'1.5px solid rgba(0,0,0,0.1)',
    borderRadius:12, padding:'13px 16px', fontFamily:'DM Sans', fontSize:14, color:'#0E0E0C',
    outline:'none', caretColor:'#1550E8', boxSizing:'border-box', transition:'border-color 0.2s',
  };

  return (
    <section style={{ background:'#F5F3EE', padding:'100px 60px', position:'relative' }}>
      {/* Privacy modal */}
      {showPrivacy && (
        <div style={{ position:'fixed', inset:0, zIndex:9000, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}
          onClick={()=>setShowPrivacy(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', border:'1.5px solid rgba(0,0,0,0.08)', borderRadius:24, padding:40, maxWidth:580, maxHeight:'80vh', overflowY:'auto', position:'relative', boxShadow:'0 32px 80px rgba(0,0,0,0.15)' }}>
            <button onClick={()=>setShowPrivacy(false)} style={{ position:'absolute', top:18, right:18, background:'#F5F3EE', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:20, color:'#6B6560', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
            <h2 style={{ fontFamily:'Playfair Display', fontSize:28, color:'#0E0E0C', marginBottom:16 }}>Aviso de Privacidad</h2>
            <div style={{ fontFamily:'DM Sans', fontSize:13, color:'#6B6560', lineHeight:1.85 }}>
              <p><strong style={{color:'#1550E8'}}>capitaldepas.com</strong> es responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.</p>
              <p style={{marginTop:12}}><strong style={{color:'#0E0E0C'}}>Datos recabados:</strong> nombre, correo electrónico, teléfono y zona de interés.</p>
              <p style={{marginTop:12}}><strong style={{color:'#0E0E0C'}}>Finalidad:</strong> Contactarle con información sobre proyectos inmobiliarios, enviarle comunicaciones comerciales y conectarle con asesores certificados.</p>
              <p style={{marginTop:12}}><strong style={{color:'#0E0E0C'}}>Transferencia:</strong> Sus datos podrán ser compartidos con los desarrolladores publicados en nuestra plataforma, únicamente para los fines descritos.</p>
              <p style={{marginTop:12}}><strong style={{color:'#0E0E0C'}}>Derechos ARCO:</strong> Puede ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición enviando un correo a <span style={{color:'#1550E8'}}>privacidad@capitaldepas.com</span>.</p>
              <p style={{marginTop:12}}><strong style={{color:'#0E0E0C'}}>Cookies:</strong> Este sitio utiliza cookies para mejorar la experiencia del usuario. Al continuar navegando, acepta su uso.</p>
            </div>
          </div>
        </div>
      )}

      <div ref={ref} style={{ opacity:vis?1:0, transform:vis?'none':'translateY(40px)', transition:'all 0.9s ease' }}>
        <div style={{ textAlign:'center', marginBottom:60 }}>
          <div style={{ fontFamily:'DM Sans', fontSize:12, letterSpacing:4, color:'rgba(21,80,232,0.6)', textTransform:'uppercase', marginBottom:12 }}>Estamos aquí</div>
          <h2 style={{ fontFamily:'Playfair Display', fontSize:48, fontWeight:700, color:'#0E0E0C', margin:0, letterSpacing:-1 }}>
            Habla con un <span style={{ color:'#1550E8' }}>asesor</span>
          </h2>
          <p style={{ fontFamily:'DM Sans', fontSize:16, color:'#9E9890', marginTop:12 }}>Sin compromisos. Te respondemos en menos de 24 horas.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, maxWidth:980, margin:'0 auto 80px' }}>
          {/* Form */}
          <div style={{ background:'#fff', borderRadius:24, padding:'36px', boxShadow:'0 4px 30px rgba(0,0,0,0.06)', border:'1.5px solid rgba(0,0,0,0.06)' }}>
            {sent ? (
              <div style={{ textAlign:'center', padding:'32px 0' }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(21,80,232,0.1)', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>✅</div>
                <h3 style={{ fontFamily:'Playfair Display', fontSize:24, color:'#0E0E0C', marginBottom:10 }}>¡Mensaje enviado!</h3>
                <p style={{ fontFamily:'DM Sans', fontSize:14, color:'#9E9890', lineHeight:1.7 }}>Un asesor certificado se pondrá en contacto contigo muy pronto.</p>
                <button onClick={()=>{setSent(false);setForm({name:'',email:'',phone:'',zone:'',message:'',privacy:false})}} style={{ marginTop:20, background:'#1550E8', border:'none', borderRadius:100, padding:'11px 28px', fontFamily:'DM Sans', fontSize:14, fontWeight:700, color:'#fff', cursor:'pointer' }} data-cursor="pointer">Enviar otro mensaje</button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <h3 style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:700, color:'#9E9890', letterSpacing:2, textTransform:'uppercase', margin:'0 0 8px' }}>Formulario de contacto</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <input value={form.name} onChange={e=>update('name',e.target.value)} placeholder="Nombre completo" required style={inp}
                    onFocus={e=>e.target.style.borderColor='#1550E8'} onBlur={e=>e.target.style.borderColor='rgba(0,0,0,0.1)'}/>
                  <input value={form.phone} onChange={e=>update('phone',e.target.value)} placeholder="Teléfono" style={inp}
                    onFocus={e=>e.target.style.borderColor='#1550E8'} onBlur={e=>e.target.style.borderColor='rgba(0,0,0,0.1)'}/>
                </div>
                <input value={form.email} onChange={e=>update('email',e.target.value)} placeholder="Correo electrónico" type="email" required style={inp}
                  onFocus={e=>e.target.style.borderColor='#1550E8'} onBlur={e=>e.target.style.borderColor='rgba(0,0,0,0.1)'}/>
                <select value={form.zone} onChange={e=>update('zone',e.target.value)} style={{...inp, color:form.zone?'#0E0E0C':'#9E9890'}}>
                  <option value="">¿Qué zona te interesa?</option>
                  {['CDMX','Cancún','Los Cabos','Puerto Escondido','Guadalajara','Monterrey','Otra'].map(z=><option key={z}>{z}</option>)}
                </select>
                <textarea value={form.message} onChange={e=>update('message',e.target.value)} placeholder="Cuéntanos más sobre lo que buscas..." rows={4}
                  style={{...inp, resize:'vertical', minHeight:96}}
                  onFocus={e=>e.target.style.borderColor='#1550E8'} onBlur={e=>e.target.style.borderColor='rgba(0,0,0,0.1)'}/>
                <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer' }}>
                  <input type="checkbox" checked={form.privacy} onChange={e=>update('privacy',e.target.checked)} style={{ accentColor:'#1550E8', marginTop:3, cursor:'pointer' }}/>
                  <span style={{ fontFamily:'DM Sans', fontSize:12, color:'#9E9890', lineHeight:1.6 }}>
                    He leído y acepto el{' '}
                    <button type="button" onClick={()=>setShowPrivacy(true)} style={{ background:'none', border:'none', color:'#1550E8', cursor:'pointer', padding:0, fontSize:12, fontFamily:'DM Sans', fontWeight:600, textDecoration:'underline' }} data-cursor="pointer">Aviso de Privacidad</button>
                  </span>
                </label>
                <button type="submit" disabled={!form.privacy} style={{ background:form.privacy?'#1550E8':'rgba(0,0,0,0.06)', border:'none', borderRadius:12, padding:'14px', fontFamily:'DM Sans', fontSize:15, fontWeight:700, color:form.privacy?'#fff':'#C5C0B8', cursor:form.privacy?'pointer':'not-allowed', transition:'all 0.3s', boxShadow:form.privacy?'0 4px 16px rgba(21,80,232,0.3)':'none' }}
                  onMouseEnter={e=>form.privacy&&(e.target.style.background='#0B37C2')}
                  onMouseLeave={e=>form.privacy&&(e.target.style.background='#1550E8')}
                  data-cursor="pointer">Enviar mensaje</button>
              </form>
            )}
          </div>

          {/* Info panel */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* WhatsApp (gated by useWhatsAppNumber) */}{waNumber && (
            <div style={{ background:'#fff', border:'1.5px solid rgba(37,211,102,0.25)', borderRadius:20, padding:'24px', boxShadow:'0 4px 20px rgba(37,211,102,0.07)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'rgba(37,211,102,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily:'DM Sans', fontSize:15, fontWeight:700, color:'#0E0E0C' }}>Escríbenos por WhatsApp</div>
                  <div style={{ fontFamily:'DM Sans', fontSize:12, color:'#9E9890', marginTop:2 }}>Respuesta en minutos</div>
                </div>
              </div>
              <a href={"https://wa.me/"+waNumber+"?text=Hola, quiero información sobre capitaldepas.com"} target="_blank" rel="noreferrer"
                style={{ display:'block', textAlign:'center', background:'rgba(37,211,102,0.1)', border:'1px solid rgba(37,211,102,0.25)', borderRadius:10, padding:'12px', fontFamily:'DM Sans', fontSize:14, fontWeight:700, color:'#16a34a', textDecoration:'none', transition:'all 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(37,211,102,0.18)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(37,211,102,0.1)'}
                data-cursor="pointer">+{waNumber}</a>
            </div>

            )}{/* Social */}
            <div style={{ background:'#fff', borderRadius:18, padding:'20px 22px', border:'1.5px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontFamily:'DM Sans', fontSize:11, letterSpacing:2, color:'#9E9890', textTransform:'uppercase', marginBottom:14 }}>Síguenos</div>
              <div style={{ display:'flex', gap:10 }}>
                {[{n:'IG',c:'#E1306C',url:'https://instagram.com/capitaldepas'},{n:'FB',c:'#1877F2',url:'https://facebook.com'},{n:'TK',c:'#ff0050',url:'https://tiktok.com'},{n:'LI',c:'#0A66C2',url:'https://linkedin.com'}].map(s=>(
                  <a key={s.n} href={s.url} target="_blank" rel="noreferrer"
                    style={{ flex:1, height:40, borderRadius:10, background:`${s.c}12`, border:`1.5px solid ${s.c}25`, display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', fontFamily:'DM Sans', fontSize:12, fontWeight:700, color:s.c, transition:'all 0.2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.background=`${s.c}22`;e.currentTarget.style.transform='translateY(-2px)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=`${s.c}12`;e.currentTarget.style.transform='none';}}
                    data-cursor="pointer">{s.n}</a>
                ))}
              </div>
            </div>

            <div style={{ background:'#fff', borderRadius:16, padding:'18px 20px', border:'1.5px solid rgba(0,0,0,0.06)' }}>
              {[{icon:'📧', text:'hola@capitaldepas.com', blue:true},{icon:'📍', text:'Av. Insurgentes Sur 1602, CDMX'},{icon:'🕐', text:'Lun–Vie 9:00–18:00'}].map((item,i)=>(
                <div key={i} style={{ fontFamily:'DM Sans', fontSize:13, color:item.blue?'#1550E8':'#6B6560', marginTop:i>0?10:0, display:'flex', gap:8, alignItems:'center' }}>
                  <span>{item.icon}</span>{item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h3 style={{ fontFamily:'Playfair Display', fontSize:36, fontWeight:700, color:'#0E0E0C', margin:0 }}>Preguntas <span style={{ color:'#1550E8' }}>frecuentes</span></h3>
          </div>
          <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1.5px solid rgba(0,0,0,0.06)', boxShadow:'0 4px 20px rgba(0,0,0,0.04)' }}>
            {FAQS.map((faq,i)=>(
              <div key={i} style={{ borderBottom: i<FAQS.length-1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ width:'100%', background:'none', border:'none', padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', textAlign:'left', gap:20 }} data-cursor="pointer">
                  <span style={{ fontFamily:'DM Sans', fontSize:15, fontWeight:600, color:openFaq===i?'#1550E8':'#0E0E0C', transition:'color 0.2s' }}>{faq.q}</span>
                  <div style={{ width:26, height:26, borderRadius:'50%', border:`1.5px solid ${openFaq===i?'#1550E8':'rgba(0,0,0,0.12)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.3s', transform:openFaq===i?'rotate(45deg)':'none', background:openFaq===i?'rgba(21,80,232,0.08)':'transparent' }}>
                    <span style={{ color:openFaq===i?'#1550E8':'#6B6560', fontSize:16, lineHeight:1, fontWeight:300 }}>+</span>
                  </div>
                </button>
                <div style={{ maxHeight:openFaq===i?200:0, overflow:'hidden', transition:'max-height 0.4s cubic-bezier(.23,1,.32,1)' }}>
                  <p style={{ fontFamily:'DM Sans', fontSize:14, color:'#6B6560', lineHeight:1.75, margin:0, padding:'0 24px 20px' }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { Contact });
