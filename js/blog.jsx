
// ── capitaldepas.com · Blog (Light Theme) ───────────────────────────────────────────

const BlogCard = ({ post, index }) => {
  const [hovered, setHovered] = React.useState(false);
  const [ref, vis] = useScrollReveal(0.1);
  return (
    <div ref={ref} style={{ opacity:vis?1:0, transform:vis?'none':'translateY(30px)', transition:`all 0.7s ${index*0.1}s ease` }}>
      <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
        style={{ background:'#fff', border:`1.5px solid ${hovered?'rgba(21,80,232,0.25)':'rgba(0,0,0,0.06)'}`, borderRadius:20, overflow:'hidden', cursor:'pointer', transition:'all 0.3s', transform:hovered?'translateY(-5px)':'none', boxShadow:hovered?'0 20px 50px rgba(21,80,232,0.1)':'0 2px 10px rgba(0,0,0,0.05)' }} data-cursor="pointer">
        {/* Thumbnail */}
        <div style={{ height:200, background:`linear-gradient(160deg,hsl(${post.accentHue},55%,85%),hsl(${post.accentHue},40%,75%))`, position:'relative', overflow:'hidden' }}>
          {Array.from({length:4}).map((_,r)=>Array.from({length:7}).map((_,c)=>(
            <div key={`${r}${c}`} style={{ position:'absolute', width:8,height:11,borderRadius:1,background:`hsla(${post.accentHue},50%,25%,${Math.random()>0.5?0.3:0.06})`,left:12+c*20,top:14+r*40 }} />
          )))}
          <div style={{ position:'absolute', top:14, left:14, background:'rgba(255,255,255,0.92)', borderRadius:100, padding:'5px 14px', fontFamily:'DM Sans', fontSize:10, fontWeight:700, color:`hsl(${post.accentHue},60%,35%)`, letterSpacing:1, textTransform:'uppercase' }}>{post.cat}</div>
          <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.8)', opacity:hovered?1:0, transition:'opacity 0.3s', display:'flex', alignItems:'flex-end', padding:18 }}>
            <span style={{ fontFamily:'DM Sans', fontSize:12, color:'#1550E8', letterSpacing:2, textTransform:'uppercase', fontWeight:700 }}>Leer artículo →</span>
          </div>
        </div>
        <div style={{ padding:'20px 22px 24px' }}>
          <div style={{ display:'flex', gap:10, marginBottom:12, alignItems:'center' }}>
            <span style={{ fontFamily:'DM Sans', fontSize:11, color:'#9E9890' }}>{post.date}</span>
            <span style={{ width:3,height:3,borderRadius:'50%',background:'#C5C0B8',display:'inline-block' }} />
            <span style={{ fontFamily:'DM Sans', fontSize:11, color:'#1550E8', fontWeight:600 }}>{post.read} lectura</span>
          </div>
          <h3 style={{ fontFamily:'Playfair Display', fontSize:20, fontWeight:600, color:hovered?'#1550E8':'#0E0E0C', lineHeight:1.35, margin:'0 0 10px', transition:'color 0.2s' }}>{post.title}</h3>
          <p style={{ fontFamily:'DM Sans', fontSize:13, color:'#9E9890', lineHeight:1.7, margin:0 }}>{post.excerpt}</p>
        </div>
      </div>
    </div>
  );
};

const Blog = () => {
  const [ref, vis] = useScrollReveal(0.05);
  return (
    <section style={{ background:'#fff', padding:'100px 60px' }}>
      <div ref={ref} style={{ opacity:vis?1:0, transform:vis?'none':'translateY(30px)', transition:'all 0.8s ease' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48 }}>
          <div>
            <div style={{ fontFamily:'DM Sans', fontSize:12, letterSpacing:4, color:'rgba(21,80,232,0.6)', textTransform:'uppercase', marginBottom:12 }}>Recursos</div>
            <h2 style={{ fontFamily:'Playfair Display', fontSize:48, fontWeight:700, color:'#0E0E0C', margin:0, letterSpacing:-1 }}>
              Blog & <span style={{ color:'#1550E8' }}>noticias</span>
            </h2>
          </div>
          <button style={{ background:'none', border:'1.5px solid rgba(21,80,232,0.2)', borderRadius:100, padding:'10px 24px', fontFamily:'DM Sans', fontSize:13, fontWeight:600, color:'#1550E8', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}
            onMouseEnter={e=>{e.target.style.background='rgba(21,80,232,0.06)';}}
            onMouseLeave={e=>{e.target.style.background='transparent';}}
            data-cursor="pointer">Ver todo el blog →</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {BLOG_POSTS.map((post,i)=><BlogCard key={post.id} post={post} index={i}/>)}
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { Blog });
