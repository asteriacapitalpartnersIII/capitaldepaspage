
// ── capitaldepas.com · Calculator (Light Theme) ─────────────────────────────────────

const Calculator = () => {
  const [price, setPrice] = React.useState(3200000);
  const [downPct, setDownPct] = React.useState(20);
  const [years, setYears] = React.useState(15);
  const [rate, setRate] = React.useState(10.5);
  const [ref, vis] = useScrollReveal(0.1);

  const downPayment = price * (downPct / 100);
  const loan = price - downPayment;
  const mr = rate / 100 / 12;
  const n = years * 12;
  const monthly = loan * (mr * Math.pow(1+mr,n)) / (Math.pow(1+mr,n)-1);
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - loan;
  const fmt = v => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(v);
  const loanPct = Math.round(loan/price*100);
  const circ = 2*Math.PI*54;

  const SliderRow = ({ label, value, min, max, step, onChange, display, suffix='' }) => (
    <div style={{ marginBottom:26 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, alignItems:'baseline' }}>
        <span style={{ fontFamily:'DM Sans', fontSize:13, color:'#6B6560' }}>{label}</span>
        <span style={{ fontFamily:'DM Sans', fontSize:20, color:'#1550E8', fontWeight:800 }}>{display}{suffix}</span>
      </div>
      <div style={{ position:'relative', height:4 }}>
        <div style={{ position:'absolute', inset:0, borderRadius:100, background:'rgba(0,0,0,0.07)' }} />
        <div style={{ position:'absolute', top:0, left:0, height:'100%', width:`${(value-min)/(max-min)*100}%`, borderRadius:100, background:'linear-gradient(90deg,#1550E8,#5B8EF5)', transition:'width 0.1s' }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0, cursor:'pointer', margin:0 }} />
        <div style={{ position:'absolute', top:'50%', left:`${(value-min)/(max-min)*100}%`, transform:'translate(-50%,-50%)', width:18, height:18, borderRadius:'50%', background:'#1550E8', border:'3px solid #fff', boxShadow:'0 2px 8px rgba(21,80,232,0.4)', pointerEvents:'none', transition:'left 0.1s' }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
        <span style={{ fontFamily:'DM Sans', fontSize:10, color:'#C5C0B8' }}>{min.toLocaleString('es-MX')}{suffix}</span>
        <span style={{ fontFamily:'DM Sans', fontSize:10, color:'#C5C0B8' }}>{max.toLocaleString('es-MX')}{suffix}</span>
      </div>
    </div>
  );

  return (
    <section style={{ background:'#fff', padding:'100px 60px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(21,80,232,0.05),transparent 70%)', pointerEvents:'none' }} />

      <div ref={ref} style={{ opacity:vis?1:0, transform:vis?'none':'translateY(40px)', transition:'all 0.9s ease' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontFamily:'DM Sans', fontSize:12, letterSpacing:4, color:'rgba(21,80,232,0.6)', textTransform:'uppercase', marginBottom:12 }}>Herramienta</div>
          <h2 style={{ fontFamily:'Playfair Display', fontSize:48, fontWeight:700, color:'#0E0E0C', margin:0, letterSpacing:-1 }}>
            Calculadora de <span style={{ color:'#1550E8' }}>crédito</span>
          </h2>
          <p style={{ fontFamily:'DM Sans', fontSize:16, color:'#9E9890', marginTop:12 }}>Estima tu mensualidad según el precio, enganche y plazo que elijas.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:36, maxWidth:980, margin:'0 auto' }}>
          {/* Sliders */}
          <div style={{ background:'#F5F3EE', border:'1.5px solid rgba(0,0,0,0.07)', borderRadius:24, padding:'36px' }}>
            <h3 style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:700, color:'#9E9890', letterSpacing:2, textTransform:'uppercase', margin:'0 0 28px' }}>Parámetros</h3>
            <SliderRow label="Precio del inmueble" value={price} min={1000000} max={15000000} step={100000} onChange={setPrice} display={fmt(price)} />
            <SliderRow label="Enganche" value={downPct} min={10} max={50} step={5} onChange={setDownPct} display={downPct} suffix="%" />
            <SliderRow label="Plazo del crédito" value={years} min={5} max={30} step={5} onChange={setYears} display={years} suffix=" años" />
            <SliderRow label="Tasa de interés anual" value={rate} min={7} max={18} step={0.5} onChange={setRate} display={rate} suffix="%" />
            <div style={{ marginTop:8, padding:'14px 18px', background:'rgba(21,80,232,0.07)', borderRadius:12, border:'1px solid rgba(21,80,232,0.12)' }}>
              <div style={{ fontFamily:'DM Sans', fontSize:11, color:'#6B6560', marginBottom:3 }}>Enganche requerido</div>
              <div style={{ fontFamily:'DM Sans', fontSize:22, color:'#1550E8', fontWeight:800 }}>{fmt(downPayment)}</div>
            </div>
          </div>

          {/* Results */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Monthly highlight */}
            <div style={{ background:'linear-gradient(135deg,#1550E8,#0B37C2)', borderRadius:24, padding:'36px', textAlign:'center', flex:1, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:'-30%', right:'-10%', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
              <div style={{ fontFamily:'DM Sans', fontSize:11, letterSpacing:3, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', marginBottom:10 }}>Mensualidad estimada</div>
              <div style={{ fontFamily:'Playfair Display', fontSize:50, fontWeight:700, color:'#fff', lineHeight:1, marginBottom:6 }}>{fmt(monthly)}</div>
              <div style={{ fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.55)' }}>por {years} años · {n} pagos</div>

              {/* Donut */}
              <div style={{ margin:'24px auto 0', width:120, height:120, position:'relative' }}>
                <svg width="120" height="120" style={{ transform:'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10"/>
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="10"
                    strokeDasharray={circ} strokeDashoffset={circ*(1-loanPct/100)} strokeLinecap="round" style={{ transition:'stroke-dashoffset 0.6s ease' }}/>
                </svg>
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ fontFamily:'DM Sans', fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:1, textTransform:'uppercase' }}>CRÉDITO</div>
                  <div style={{ fontFamily:'DM Sans', fontSize:20, color:'#fff', fontWeight:800 }}>{loanPct}%</div>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div style={{ background:'#F5F3EE', border:'1.5px solid rgba(0,0,0,0.07)', borderRadius:20, padding:'22px 26px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[
                  { label:'Monto del crédito', val:fmt(loan), blue:false },
                  { label:'Total a pagar', val:fmt(totalPaid), blue:false },
                  { label:'Total intereses', val:fmt(totalInterest), blue:true },
                  { label:'Tasa mensual', val:`${(rate/12).toFixed(2)}%`, blue:false },
                ].map(item=>(
                  <div key={item.label} style={{ padding:'10px 0', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontFamily:'DM Sans', fontSize:11, color:'#9E9890', marginBottom:4, textTransform:'uppercase', letterSpacing:0.5 }}>{item.label}</div>
                    <div style={{ fontFamily:'DM Sans', fontSize:15, fontWeight:700, color:item.blue?'#1550E8':'#0E0E0C' }}>{item.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:14, fontFamily:'DM Sans', fontSize:11, color:'#C5C0B8', lineHeight:1.6 }}>* Cálculo aproximado. La tasa real depende de tu perfil crediticio y banco.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { Calculator });
