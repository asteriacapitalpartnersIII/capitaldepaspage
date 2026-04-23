
// ── capitaldepas.com · Cursor (Light Theme) ─────────────────────────────────────────

const Cursor = () => {
  const dotRef  = React.useRef(null);
  const ringRef = React.useRef(null);
  const labelRef = React.useRef(null);
  const pos  = React.useRef({ x:-100, y:-100 });
  const ring = React.useRef({ x:-100, y:-100 });
  const hoverState = React.useRef('default');

  React.useEffect(() => {
    let rafId;
    const onMove = (e) => {
      pos.current = { x:e.clientX, y:e.clientY };
      if (dotRef.current) dotRef.current.style.transform = `translate(${e.clientX-4}px,${e.clientY-4}px)`;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;
      hoverState.current = el.closest('[data-cursor="property"]') ? 'property'
        : el.closest('button,a,[data-cursor="pointer"]') ? 'button' : 'default';
    };
    const animate = () => {
      const sp = 0.11;
      ring.current.x += (pos.current.x - ring.current.x) * sp;
      ring.current.y += (pos.current.y - ring.current.y) * sp;
      if (ringRef.current) {
        const s = hoverState.current;
        const size = s==='button'?52 : s==='property'?68 : 32;
        const off  = size/2;
        ringRef.current.style.transform = `translate(${ring.current.x-off}px,${ring.current.y-off}px)`;
        ringRef.current.style.width  = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.background = s==='button' ? 'rgba(21,80,232,0.1)' : s==='property' ? 'rgba(21,80,232,0.08)' : 'transparent';
        ringRef.current.style.borderColor = s==='default' ? 'rgba(21,80,232,0.5)' : '#1550E8';
        if (labelRef.current) labelRef.current.style.opacity = s==='property'?'1':'0';
      }
      rafId = requestAnimationFrame(animate);
    };
    document.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(animate);
    const hide = () => { if(ringRef.current) ringRef.current.style.opacity='0'; if(dotRef.current) dotRef.current.style.opacity='0'; };
    const show = () => { if(ringRef.current) ringRef.current.style.opacity='1'; if(dotRef.current) dotRef.current.style.opacity='1'; };
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);
    return () => { cancelAnimationFrame(rafId); document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseleave',hide); document.removeEventListener('mouseenter',show); };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{ position:'fixed',top:0,left:0,width:8,height:8,borderRadius:'50%',background:'#1550E8',pointerEvents:'none',zIndex:99999,willChange:'transform' }} />
      <div ref={ringRef} style={{ position:'fixed',top:0,left:0,width:32,height:32,borderRadius:'50%',border:'1.5px solid rgba(21,80,232,0.5)',background:'transparent',pointerEvents:'none',zIndex:99998,transition:'width 0.3s cubic-bezier(.23,1,.32,1),height 0.3s cubic-bezier(.23,1,.32,1),background 0.3s,border-color 0.3s',willChange:'transform',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <span ref={labelRef} style={{ fontSize:8,fontFamily:'DM Sans',letterSpacing:2,color:'#1550E8',textTransform:'uppercase',fontWeight:700,opacity:0,transition:'opacity 0.2s',userSelect:'none' }}>VER</span>
      </div>
    </>
  );
};

Object.assign(window, { Cursor });
