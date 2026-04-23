
// ── capitaldepas.com · Navigation (Light) ────────────────────────────────────

const CapitalDepasLogo = ({ size = 'md', onClick }) => {
  const s = size === 'lg' ? 1.4 : size === 'sm' ? 0.75 : 1;
  return (
    <div onClick={onClick} data-cursor="pointer" style={{ display:'flex', alignItems:'center', gap: 10*s, cursor:'pointer', flexShrink:0 }}>
      {/* Icon mark — building with windows */}
      <div style={{ width:36*s, height:36*s, borderRadius:9*s, background:'#1550E8', position:'relative', overflow:'hidden', flexShrink:0, boxShadow:`0 4px ${12*s}px rgba(21,80,232,0.35)` }}>
        {[[5,6],[14,6],[5,13],[14,13],[5,20],[14,20],[5,27],[14,27]].map(([x,y],i) => (
          <div key={i} style={{ position:'absolute', width:8*s, height:5*s, borderRadius:1, background:'rgba(255,255,255,0.85)', left:x*s, top:y*s }} />
        ))}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'40%', background:'linear-gradient(to bottom,rgba(255,255,255,0.15),transparent)' }} />
      </div>
      {/* Wordmark */}
      <div style={{ fontFamily:'DM Sans', fontWeight:800, fontSize:20*s, letterSpacing:-0.8, lineHeight:1 }}>
        <span style={{ color:'#0E0E0C' }}>capital</span>
        <span style={{ color:'#1550E8' }}>depas</span>
        <span style={{ color:'rgba(21,80,232,0.35)', fontSize:12*s, fontWeight:500 }}>.com</span>
      </div>
    </div>
  );
};

const Nav = ({ currentPage, setPage }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label:'Proyectos', page:'listings' },
    { label:'Mapa', page:'map' },
    { label:'Blog', page:'blog' },
    { label:'Contacto', page:'contact' },
  ];

  return (
    <>
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:1000,
        padding: scrolled ? '12px 56px' : '20px 56px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        transition:'all 0.35s cubic-bezier(.23,1,.32,1)',
        background: scrolled ? 'rgba(245,243,238,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
      }}>
        <CapitalDepasLogo onClick={() => setPage('home')} />

        <div style={{ display:'flex', alignItems:'center', gap:36 }}>
          {links.map(l => (
            <button key={l.page} onClick={() => setPage(l.page)} style={{
              background:'none', border:'none', cursor:'pointer',
              fontFamily:'DM Sans', fontSize:14, fontWeight:500,
              color: currentPage===l.page ? '#1550E8' : '#6B6560',
              letterSpacing:0.2, padding:'4px 0', position:'relative', transition:'color 0.25s',
            }} data-cursor="pointer"
              onMouseEnter={e => e.target.style.color='#1550E8'}
              onMouseLeave={e => e.target.style.color = currentPage===l.page?'#1550E8':'#6B6560'}
            >
              {l.label}
              <span style={{ position:'absolute', bottom:-2, left:0, right:0, height:2, background:'#1550E8', borderRadius:2, transform: currentPage===l.page?'scaleX(1)':'scaleX(0)', transformOrigin:'left', transition:'transform 0.3s cubic-bezier(.23,1,.32,1)' }} />
            </button>
          ))}
          <button onClick={() => setPage('listings')} style={{
            fontFamily:'DM Sans', fontSize:13, fontWeight:700,
            color:'#fff', background:'#1550E8',
            border:'none', borderRadius:100, cursor:'pointer',
            padding:'11px 26px', letterSpacing:0.3,
            boxShadow:'0 4px 16px rgba(21,80,232,0.3)',
            transition:'all 0.25s',
          }}
            onMouseEnter={e => { e.target.style.background='#0B37C2'; e.target.style.transform='scale(1.04)'; e.target.style.boxShadow='0 6px 20px rgba(21,80,232,0.4)'; }}
            onMouseLeave={e => { e.target.style.background='#1550E8'; e.target.style.transform='scale(1)'; e.target.style.boxShadow='0 4px 16px rgba(21,80,232,0.3)'; }}
            data-cursor="pointer"
          >
            Buscar depa
          </button>
        </div>
      </nav>

      {/* Scroll progress */}
      <div style={{ position:'fixed', top:0, left:0, right:0, height:3, zIndex:1001, background:'rgba(21,80,232,0.08)' }}>
        <div id="scroll-progress" style={{ height:'100%', background:'linear-gradient(90deg,#1550E8,#5B8EF5)', width:'0%', transition:'width 0.1s linear', borderRadius:100 }} />
      </div>
    </>
  );
};

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    const el = document.getElementById('scroll-progress');
    if (!el) return;
    el.style.width = `${(window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%`;
  });
}

Object.assign(window, { Nav, CapitalDepasLogo });
