import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import ThreeBackground from './ThreeBackground';
import GlitchText      from './GlitchText';
import EventCard        from './EventCard';
import './schedule.css';

// ─── Data ─────────────────────────────────────────
const SCHEDULE = [
  { id:'e01', eventName:'Rang De Radiant (Valorant)', day:'Day 0', category:'E-Sports',  venue:'IT Block (DT-2)',  startTime:'10:00 AM', endTime:'01:00 PM' },
  { id:'e02', eventName:'Meme Mandali',                day:'Day 0', category:'Dramatics', venue:'A1-32',            startTime:'11:00 AM', endTime:'01:00 PM' },
  { id:'e03', eventName:'Swaroop (Solo Ramp Walk)',    day:'Day 0', category:'Fashion',   venue:'Auditorium',       startTime:'01:00 PM', endTime:'03:00 PM' },
  { id:'e04', eventName:'Nukkad Natak',                day:'Day 0', category:'Specials',  venue:'Quadrangle',       startTime:'05:00 PM', endTime:'05:30 PM' },
  { id:'e05', eventName:'Code Storm',                  day:'Day 1', category:'Technical', venue:'CS Block (Lab 3)', startTime:'09:00 AM', endTime:'12:00 PM' },
  { id:'e06', eventName:'Startup Pitch Battle',        day:'Day 1', category:'Technical', venue:'Seminar Hall',     startTime:'09:30 AM', endTime:'11:30 AM' },
  { id:'e07', eventName:'Battle of Bands',             day:'Day 1', category:'Music',     venue:'Open Stage',       startTime:'12:00 PM', endTime:'02:00 PM' },
  { id:'e08', eventName:'Robo Wars',                   day:'Day 1', category:'Technical', venue:'Workshop Arena',   startTime:'02:00 PM', endTime:'05:00 PM' },
  { id:'e09', eventName:"Mr. & Ms. AURA",              day:'Day 1', category:'Fashion',   venue:'Main Auditorium',  startTime:'06:00 PM', endTime:'09:00 PM' },
  { id:'e10', eventName:'Hackathon: Round 1',          day:'Day 2', category:'Technical', venue:'IT Block (DT-1)',  startTime:'08:00 AM', endTime:'02:00 PM' },
  { id:'e11', eventName:'DJ Night — AURA RAVE',        day:'Day 2', category:'Music',     venue:'Main Ground',      startTime:'08:00 PM', endTime:'11:00 PM' },
  { id:'e12', eventName:'Pro Show & Prize Ceremony',   day:'Day 2', category:'Specials',  venue:'Main Auditorium',  startTime:'07:00 PM', endTime:'09:00 PM' },
];

const DAYS = [
  { label:'Day 0', sub:'QUALIFIER', shape:'circle',   color:'#ff0050', tabCls:'tab-pink',  quote:'The opening move.' },
  { label:'Day 1', sub:'ARENA',     shape:'triangle', color:'#00fff0', tabCls:'tab-teal',  quote:'The battle peaks.' },
  { label:'Day 2', sub:'FINALE',    shape:'square',   color:'#f5a623', tabCls:'tab-amber', quote:'Only one survives.' },
];

// ─── Arena categories ──────────────────────────────
const ARENAS = [
  {
    name:'Fashion & Arts',
    icon:'□', color:'#f5a623',
    desc:'Ramp walks, design battles, visual arts — where style is survival',
    gradient:'linear-gradient(135deg, rgba(245,166,35,0.22) 0%, rgba(60,30,0,0.8) 100%)',
    border:'rgba(245,166,35,0.35)',
    events:['Fashion','Dramatics'],
    count:3,
    // Illustrative SVG bg
    svgBg: (
      <svg viewBox="0 0 400 300" style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.14}}>
        <circle cx="320" cy="150" r="140" stroke="#f5a623" strokeWidth="1.5" fill="none"/>
        <circle cx="320" cy="150" r="100" stroke="#f5a623" strokeWidth="0.8" fill="none" opacity="0.6"/>
        <line x1="0" y1="150" x2="400" y2="150" stroke="#f5a623" strokeWidth="0.5" opacity="0.4"/>
        <line x1="320" y1="0" x2="320" y2="300" stroke="#f5a623" strokeWidth="0.5" opacity="0.4"/>
        {/* Abstract dress silhouette */}
        <path d="M 180 40 L 200 80 L 240 280 L 150 280 L 190 80 Z" stroke="#f5a623" strokeWidth="1" fill="none" opacity="0.5"/>
        <ellipse cx="190" cy="42" rx="20" ry="24" stroke="#f5a623" strokeWidth="1" fill="none" opacity="0.5"/>
      </svg>
    ),
  },
  {
    name:'Music & Performing',
    icon:'◯', color:'#ff0050',
    desc:'Bands, solos, nukkad natak — the stage is your arena',
    gradient:'linear-gradient(135deg, rgba(255,0,80,0.22) 0%, rgba(60,0,20,0.8) 100%)',
    border:'rgba(255,0,80,0.35)',
    events:['Music','Specials'],
    count:3,
    svgBg: (
      <svg viewBox="0 0 400 300" style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.14}}>
        {/* Sound waves */}
        {[40,60,80,100,120].map((r,i)=>(
          <circle key={i} cx="80" cy="150" r={r} stroke="#ff0050" strokeWidth="1" fill="none" opacity={0.8-i*0.14}/>
        ))}
        {/* Mic silhouette */}
        <ellipse cx="300" cy="100" rx="28" ry="50" stroke="#ff0050" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <line x1="300" y1="150" x2="300" y2="220" stroke="#ff0050" strokeWidth="1.5" opacity="0.6"/>
        <path d="M 270 220 Q 300 240 330 220" stroke="#ff0050" strokeWidth="1.5" fill="none" opacity="0.6"/>
        {/* Audio bars */}
        {[180,195,210,225,240,255,270,285].map((x,i)=>(
          <rect key={i} x={x} y={280-(i%2===0?80:50)} width="8" height={i%2===0?80:50} fill="#ff0050" opacity="0.3"/>
        ))}
      </svg>
    ),
  },
  {
    name:'Tech & E-Sports',
    icon:'△', color:'#00fff0',
    desc:'Hackathons, gaming tournaments, robotics — where code meets chaos',
    gradient:'linear-gradient(135deg, rgba(0,255,240,0.18) 0%, rgba(0,40,60,0.8) 100%)',
    border:'rgba(0,255,240,0.3)',
    events:['Technical','E-Sports'],
    count:6,
    svgBg: (
      <svg viewBox="0 0 400 300" style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.14}}>
        {/* Circuit paths */}
        <path d="M 20 150 L 80 150 L 80 80 L 160 80 L 160 120 L 280 120 L 280 80 L 360 80" stroke="#00fff0" strokeWidth="1" fill="none"/>
        <path d="M 20 200 L 100 200 L 100 250 L 200 250 L 200 180 L 380 180" stroke="#00fff0" strokeWidth="1" fill="none"/>
        {/* Nodes */}
        {[[80,150],[160,80],[280,120],[100,200],[200,250]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="5" fill="none" stroke="#00fff0" strokeWidth="1.5"/>
        ))}
        {/* Triangle grid */}
        <polygon points="320,40 380,140 260,140" stroke="#00fff0" strokeWidth="1" fill="none" opacity="0.5"/>
        <polygon points="320,70 360,130 280,130" stroke="#00fff0" strokeWidth="0.6" fill="none" opacity="0.4"/>
      </svg>
    ),
  },
];

// ─── Guard Silhouette SVG ─────────────────────────
const GuardSilhouette = ({ type='circle', style={} }) => {
  const shapeOnMask = type==='circle'
    ? <circle cx="50" cy="50" r="36" stroke="white" strokeWidth="4" fill="none"/>
    : type==='triangle'
    ? <polygon points="50,16 82,82 18,82" stroke="white" strokeWidth="4" fill="none"/>
    : <rect x="16" y="16" width="68" height="68" stroke="white" strokeWidth="4" fill="none"/>;

  return (
    <svg viewBox="0 0 200 380" style={style} xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="60" y="200" width="80" height="120" rx="4" fill="currentColor" opacity="0.9"/>
      {/* Hood/head area */}
      <ellipse cx="100" cy="150" rx="48" ry="55" fill="currentColor" opacity="0.95"/>
      {/* Hood top */}
      <ellipse cx="100" cy="110" rx="40" ry="50" fill="currentColor" opacity="0.9"/>
      {/* Mask */}
      <ellipse cx="100" cy="150" rx="32" ry="30" fill="rgba(0,0,0,0.85)"/>
      {/* Arms */}
      <rect x="18" y="205" width="44" height="88" rx="22" fill="currentColor" opacity="0.88"/>
      <rect x="138" y="205" width="44" height="88" rx="22" fill="currentColor" opacity="0.88"/>
      {/* Shape on mask */}
      <g transform="translate(70,130) scale(0.6)">
        {shapeOnMask}
      </g>
      {/* Tracksuit stripe */}
      <rect x="93" y="200" width="14" height="100" fill="white" opacity="0.18"/>
    </svg>
  );
};

// ─── Day selector shape icons ─────────────────────
const DayShapeIcon = ({ shape, color, active, size=44 }) => {
  const stroke = active ? color : '#2a2a2a';
  const fill   = active ? color + '20' : 'none';
  const glow   = active ? `drop-shadow(0 0 10px ${color}99)` : 'none';
  const st     = { filter:glow, transition:'all 0.3s' };
  if(shape==='circle')
    return <svg width={size} height={size} viewBox="0 0 46 46" style={st}>
      <circle cx="23" cy="23" r="18" stroke={stroke} strokeWidth="2" fill={fill}/>
      {active&&<circle cx="23" cy="23" r="11" stroke={stroke} strokeWidth="0.8" fill="none" opacity="0.4"/>}
    </svg>;
  if(shape==='triangle')
    return <svg width={size} height={size} viewBox="0 0 46 46" style={st}>
      <polygon points="23,5 41,39 5,39" stroke={stroke} strokeWidth="2" fill={fill}/>
      {active&&<polygon points="23,16 33,37 13,37" stroke={stroke} strokeWidth="0.8" fill="none" opacity="0.4"/>}
    </svg>;
  return <svg width={size} height={size} viewBox="0 0 46 46" style={st}>
    <rect x="5" y="5" width="36" height="36" stroke={stroke} strokeWidth="2" fill={fill}/>
    {active&&<rect x="14" y="14" width="18" height="18" stroke={stroke} strokeWidth="0.8" fill="none" opacity="0.4"/>}
  </svg>;
};

// ─── Origami diamond ──────────────────────────────
const OrigamiDiamond = ({ color, size=160, label, sublabel, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale:1.06, rotate: 47 }}
    whileTap={{ scale:0.96 }}
    style={{
      width:size, height:size, transform:'rotate(45deg)', borderRadius:8,
      background:`linear-gradient(135deg, ${color}, ${color}cc)`,
      border:'none', cursor:'none', position:'relative', outline:'none',
      boxShadow:`0 0 40px ${color}44, 0 0 80px ${color}22`,
    }}
    transition={{ type:'spring', bounce:0.4 }}
  >
    {/* Inner fold lines */}
    <div style={{
      position:'absolute', inset:0, borderRadius:8,
      backgroundImage:`linear-gradient(135deg, transparent 49%, rgba(0,0,0,0.2) 49%, rgba(0,0,0,0.2) 51%, transparent 51%),
                       linear-gradient(45deg, transparent 49%, rgba(0,0,0,0.2) 49%, rgba(0,0,0,0.2) 51%, transparent 51%)`,
    }}/>
  </motion.button>
);

// ─── Neon bars decoration ─────────────────────────
const NeonBars = () => {
  const bars = [
    { left:'8%',  color:'#ff0050', height:'78%', op:0.55, dur:'3.2s', delay:'0s'   },
    { left:'14%', color:'#e91e8c', height:'55%', op:0.32, dur:'4s',   delay:'0.5s' },
    { left:'82%', color:'#00fff0', height:'66%', op:0.48, dur:'3.8s', delay:'0.8s' },
    { left:'88%', color:'#ff0050', height:'80%', op:0.55, dur:'2.9s', delay:'0.2s' },
    { left:'50%', color:'#ff0050', height:'30%', op:0.14, dur:'5s',   delay:'1s'   },
  ];
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden' }}>
      {bars.map((b,i)=>(
        <div key={i} className="neon-bar" style={{
          left:b.left, bottom:0, height:b.height, width:'2px',
          background:`linear-gradient(0deg, ${b.color}, transparent)`,
          boxShadow:`0 0 12px ${b.color}, 0 0 28px ${b.color}44`,
          opacity:b.op, '--dur':b.dur, '--delay':b.delay, '--base-op':b.op,
        }}/>
      ))}
    </div>
  );
};

// ─── Custom cursor ────────────────────────────────
const CustomCursor = () => {
  const dot  = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    let dx = 0, dy = 0;
    const move = (e) => {
      dx = e.clientX; dy = e.clientY;
      if(dot.current)  { dot.current.style.left=`${dx}px`; dot.current.style.top=`${dy}px`; }
    };
    const animate = () => {
      if(ring.current) {
        const cx = parseFloat(ring.current.style.left||0);
        const cy = parseFloat(ring.current.style.top||0);
        ring.current.style.left = `${cx + (dx-cx)*0.15}px`;
        ring.current.style.top  = `${cy + (dy-cy)*0.15}px`;
      }
      requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', move);
    const raf = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={dot}  className="cursor-dot"/>
      <div ref={ring} className="cursor-ring"/>
    </>
  );
};

// ─── Main Page ────────────────────────────────────
export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState('Day 0');
  const [now, setNow]             = useState(new Date());
  const [isNavScrolled, setNavScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pad = (n) => String(n).padStart(2,'0');
  const clockStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const filtered    = SCHEDULE.filter(e => e.day === activeDay);
  const activeDayCfg = DAYS.find(d => d.label === activeDay);

  const TICKER_TEXT = '◯  AURA 2026 CULTURAL FEST  △  THE GAMES BEGIN  □  456 CONTESTANTS  ◯  FASHION · MUSIC · DRAMA · TECH · E-SPORTS  △  ONCE YOU START THERE IS NO TURNING BACK  □  MAY THE BEST SURVIVE  ◯  RED LIGHT — FREEZE  △  GREEN LIGHT — PERFORM  □  VIOLATORS WILL BE ELIMINATED  ◯  ';

  return (
    <>
      <CustomCursor/>
      <div className="scanlines"/>

      {/* ── Three.js BG ──────────────────────────────── */}
      <ThreeBackground/>

      <div style={{ position:'relative', zIndex:2, minHeight:'100vh' }}>

        {/* ══════════════════════════════════════════════
            NAVBAR
        ══════════════════════════════════════════════ */}
        <nav className="navbar" style={{
          background: isNavScrolled
            ? 'rgba(6,6,8,0.96)' : 'linear-gradient(180deg, rgba(6,6,8,0.9) 0%, transparent 100%)',
          borderBottom: isNavScrolled ? '1px solid rgba(255,0,80,0.1)' : '1px solid transparent',
          transition:'all 0.4s',
        }}>
          {/* Logo */}
          <div className="nav-logo">
            <svg width="28" height="28" viewBox="0 0 46 46">
              <circle cx="10" cy="23" r="7" stroke="#ff0050" strokeWidth="2" fill="none"/>
              <polygon points="28,16 40,36 16,36" stroke="#00fff0" strokeWidth="2" fill="none"/>
              <rect x="34" y="15" width="12" height="12" stroke="#f5a623" strokeWidth="2" fill="none"/>
            </svg>
            <span className="nav-logo-text">AURA 2026</span>
          </div>

          {/* Links */}
          <div className="nav-links">
            {['ABOUT','EVENTS','ARENAS','SCHEDULE'].map(l => (
              <button key={l} className="nav-link">{l}</button>
            ))}
            <div className="nav-badge flicker">LIVE</div>
          </div>
        </nav>

        {/* ══════════════════════════════════════════════
            TICKER
        ══════════════════════════════════════════════ */}
        <div className="ticker-wrap" style={{ marginTop:0 }}>
          <span className="ticker-inner"
            style={{ fontFamily:"'Orbitron',monospace",fontSize:'0.56rem',color:'rgba(255,0,80,0.7)',letterSpacing:'0.18em',fontWeight:600 }}>
            {TICKER_TEXT}
          </span>
        </div>

        {/* ══════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════ */}
        <section ref={heroRef} style={{
          minHeight:'100vh', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          padding:'8rem 3rem 4rem', position:'relative', overflow:'hidden',
        }}>

          {/* Neon vertical bars */}
          <NeonBars/>

          {/* Guard silhouettes — left */}
          <div style={{ position:'absolute',left:'-2%',bottom:0,height:'85%',opacity:0.18,pointerEvents:'none',zIndex:1 }}>
            <GuardSilhouette type="circle"
              style={{ height:'100%', color:'#e91e8c' }}/>
          </div>
          {/* Guard silhouettes — right */}
          <div style={{ position:'absolute',right:'-2%',bottom:0,height:'80%',opacity:0.14,pointerEvents:'none',zIndex:1,transform:'scaleX(-1)' }}>
            <GuardSilhouette type="square"
              style={{ height:'100%', color:'#ff0050' }}/>
          </div>
          {/* Guard center faint */}
          <div style={{ position:'absolute',left:'50%',bottom:0,height:'60%',opacity:0.05,pointerEvents:'none',zIndex:1,transform:'translateX(-50%)' }}>
            <GuardSilhouette type="triangle"
              style={{ height:'100%', color:'white' }}/>
          </div>

          {/* Neon doorframe decoration */}
          <div style={{
            position:'absolute', left:'50%', top:'50%',
            transform:'translate(-50%,-50%)',
            width:'min(600px,82vw)', height:'min(700px,80vh)',
            border:'1px solid rgba(255,0,80,0.12)',
            borderRadius:2, pointerEvents:'none', zIndex:0,
            boxShadow:'0 0 60px rgba(255,0,80,0.06), inset 0 0 60px rgba(255,0,80,0.03)',
          }}/>
          <div style={{
            position:'absolute', left:'50%', top:'50%',
            transform:'translate(-50%,-50%)',
            width:'min(540px,76vw)', height:'min(640px,74vh)',
            border:'1px solid rgba(0,255,240,0.07)',
            borderRadius:2, pointerEvents:'none', zIndex:0,
          }}/>

          {/* Content */}
          <div style={{ position:'relative',zIndex:3,textAlign:'center' }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity:0, letterSpacing:'1.5em' }}
              animate={{ opacity:1, letterSpacing:'0.42em' }}
              transition={{ duration:1.8, ease:'easeOut' }}
              style={{
                fontFamily:"'Orbitron',monospace",fontSize:'0.6rem',
                color:'rgba(255,0,80,0.5)',letterSpacing:'0.42em',
                marginBottom:'2rem',fontWeight:700,
              }}
            >
              ◯ &nbsp;△ &nbsp;□ &nbsp;·&nbsp; THE CULTURAL GAMES &nbsp;·&nbsp; ◯ &nbsp;△ &nbsp;□
            </motion.div>

            {/* Main title */}
            <motion.div
              initial={{ opacity:0, scale:0.82 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ duration:0.9, delay:0.2, ease:[0.22,1,0.36,1] }}
              style={{ marginBottom:'0.5rem' }}
            >
              {/* AURA stencil behind */}
              <div style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:'clamp(5rem,18vw,13rem)',
                lineHeight:0.88, letterSpacing:'0.14em',
                color:'transparent',
                WebkitTextStroke:'1px rgba(255,0,80,0.2)',
                position:'absolute', left:'50%', top:'50%',
                transform:'translate(-50%, -58%)',
                pointerEvents:'none', userSelect:'none',
                whiteSpace:'nowrap', zIndex:0,
              }}>
                AURA
              </div>

              {/* SCHEDULE glitch */}
              <div style={{ fontSize:'clamp(3rem,11vw,8.5rem)', position:'relative', zIndex:2 }}>
                <GlitchText speed={0.7} enableShadows enableOnHover={false}>
                  SCHEDULE
                </GlitchText>
              </div>
            </motion.div>

            {/* Sub-headline */}
            <motion.div
              initial={{ opacity:0, y:18 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.55 }}
              style={{ marginBottom:'2.5rem' }}
            >
              <div style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:'clamp(1rem,3.5vw,1.8rem)',
                color:'rgba(255,255,255,0.55)',letterSpacing:'0.3em',
              }}>
                THREE DAYS. TWELVE ARENAS. ONE WINNER.
              </div>
            </motion.div>

            {/* CTA hover glitch */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }}
              transition={{ delay:0.85 }}
              style={{ display:'inline-block', marginBottom:'3rem', fontSize:'clamp(0.75rem,2vw,0.95rem)', opacity:0.3 }}
            >
              <GlitchText speed={3} enableShadows={false} enableOnHover>THE GAMES BEGIN</GlitchText>
            </motion.div>

            {/* Live clock */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }}
              style={{
                fontFamily:"'Orbitron',monospace",fontSize:'clamp(1.4rem,4vw,2.8rem)',
                fontWeight:700,letterSpacing:'0.1em',
                background:'linear-gradient(135deg, #ff0050, #e91e8c)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              }}
              className="flicker"
            >
              {clockStr}
            </motion.div>
            <div style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:'0.6rem',color:'rgba(255,255,255,0.18)',letterSpacing:'0.38em',marginTop:6 }}>
              IST · LIVE CLOCK
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:1.8 }}
            style={{ position:'absolute',bottom:'2.5rem',left:'50%',transform:'translateX(-50%)',zIndex:3 }}
          >
            <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:6 }}>
              <div style={{ fontFamily:"'Orbitron',monospace",fontSize:'0.5rem',color:'rgba(255,255,255,0.2)',letterSpacing:'0.3em' }}>SCROLL</div>
              <svg width="18" height="28" viewBox="0 0 18 28">
                <rect x="1" y="1" width="16" height="26" rx="8" stroke="rgba(255,0,80,0.35)" strokeWidth="1.5" fill="none"/>
                <motion.circle animate={{cy:[8,18,8]}} transition={{repeat:Infinity,duration:1.8}} cx="9" cy="8" r="3" fill="#ff0050"/>
              </svg>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════
            ARENAS SECTION
        ══════════════════════════════════════════════ */}
        <section style={{
          background:'linear-gradient(180deg, rgba(6,6,8,0) 0%, rgba(6,6,8,0.98) 8%)',
          padding:'6rem 3rem', position:'relative',
        }}>
          {/* Top slash divider */}
          <div style={{ height:1, marginBottom:'4rem', background:'linear-gradient(90deg, transparent, rgba(255,0,80,0.3) 35%, rgba(0,255,240,0.3) 65%, transparent)', transform:'skewX(-2deg)' }}/>

          <motion.div
            initial={{ opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.6 }}
            style={{ textAlign:'center', marginBottom:'3.5rem' }}
          >
            <div className="section-eyebrow" style={{ justifyContent:'center', marginBottom:'1.2rem' }}>ARENAS</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2rem,6vw,4.5rem)',letterSpacing:'0.1em',color:'#f0f0f0',lineHeight:1 }}>
              CHOOSE YOUR <span style={{ color:'#ff0050' }}>BATTLEGROUND</span>
            </div>
            <p style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:'1rem',color:'rgba(255,255,255,0.38)',maxWidth:480,margin:'0.8rem auto 0',letterSpacing:'0.04em',lineHeight:1.6 }}>
              Three arenas. Every contestant picks their fight. There are no second chances.
            </p>
          </motion.div>

          {/* Arena cards */}
          <div style={{ maxWidth:1160,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',gap:'1.5rem' }}>
            {ARENAS.map((arena, ai) => (
              <motion.div
                key={arena.name}
                initial={{ opacity:0, y:40 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ duration:0.6, delay:ai*0.12 }}
              >
                <div className="arena-card" style={{ border:`1px solid ${arena.border}`,minHeight:260 }}>
                  {/* Gradient bg */}
                  <div className="arena-card-bg" style={{ background:arena.gradient }}/>
                  {/* SVG illustration */}
                  {arena.svgBg}

                  {/* Content */}
                  <div style={{ position:'relative',zIndex:2,padding:'2.2rem' }}>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'3.5rem',color:arena.color,lineHeight:1,marginBottom:'0.2rem',filter:`drop-shadow(0 0 16px ${arena.color}66)` }}>
                      {arena.icon}
                    </div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.6rem',color:'#f0f0f0',letterSpacing:'0.1em',marginBottom:'0.6rem' }}>
                      {arena.name}
                    </div>
                    <p style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:'0.88rem',color:'rgba(255,255,255,0.5)',lineHeight:1.6,marginBottom:'1.4rem' }}>
                      {arena.desc}
                    </p>
                    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                      <span style={{ fontFamily:"'Orbitron',monospace",fontSize:'0.55rem',color:arena.color,letterSpacing:'0.2em',fontWeight:700 }}>
                        {arena.count} EVENTS
                      </span>
                      <div style={{ display:'flex',gap:6 }}>
                        {arena.events.map(ev => (
                          <span key={ev} style={{
                            fontFamily:"'Rajdhani',sans-serif",fontSize:'0.6rem',fontWeight:700,
                            padding:'2px 8px',borderRadius:3,letterSpacing:'0.12em',
                            background:arena.color+'18',border:`1px solid ${arena.color}2e`,
                            color:arena.color,
                          }}>{ev}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            ORIGAMI / CHOOSE YOUR PATH SECTION
        ══════════════════════════════════════════════ */}
        <section style={{ padding:'5rem 3rem', position:'relative', background:'rgba(6,6,8,0.98)', overflow:'hidden' }}>
          {/* Radial glow behind */}
          <div style={{
            position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',
            width:600,height:400,borderRadius:'50%',
            background:'radial-gradient(ellipse, rgba(255,0,80,0.05) 0%, transparent 70%)',
            pointerEvents:'none',
          }}/>

          <motion.div
            initial={{ opacity:0 }}
            whileInView={{ opacity:1 }}
            viewport={{ once:true }}
            transition={{ duration:0.8 }}
            style={{ textAlign:'center', marginBottom:'3.5rem' }}
          >
            <div className="section-eyebrow" style={{ justifyContent:'center', marginBottom:'1rem' }}>CRITICAL DECISION</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2rem,5.5vw,4rem)',letterSpacing:'0.1em',color:'#f0f0f0',lineHeight:1 }}>
              PICK YOUR <span style={{ color:'#ff0050' }}>FATE</span>
            </div>
            <p style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:'0.9rem',color:'rgba(255,255,255,0.32)',marginTop:'0.6rem',letterSpacing:'0.08em' }}>
              In this arena, your allegiance defines your journey
            </p>
          </motion.div>

          <div style={{ display:'flex',justifyContent:'center',alignItems:'center',gap:'clamp(2rem,8vw,8rem)',flexWrap:'wrap' }}>
            {/* Red Diamond */}
            <motion.div
              initial={{ opacity:0, x:-60 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.7, delay:0.1 }}
              style={{ textAlign:'center' }}
            >
              <div style={{ display:'flex',justifyContent:'center',marginBottom:'2rem' }}>
                <OrigamiDiamond color="#ff0050" size={150} label="RED SIDE" sublabel="For the performers"/>
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.5rem',color:'#f0f0f0',letterSpacing:'0.12em',marginBottom:'0.3rem' }}>
                WILL YOU GO RED?
              </div>
              <p style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:'0.78rem',color:'rgba(255,255,255,0.35)',letterSpacing:'0.06em',marginBottom:'1rem' }}>
                Fashion. Drama. Music. Where art meets survival.
              </p>
              <button style={{
                fontFamily:"'Orbitron',monospace",fontSize:'0.65rem',fontWeight:700,
                padding:'10px 28px',border:'1.5px solid #ff0050',borderRadius:4,
                color:'#ff0050',background:'rgba(255,0,80,0.1)',cursor:'none',
                letterSpacing:'0.2em',transition:'all 0.25s',
                boxShadow:'0 0 20px rgba(255,0,80,0.2)',
              }}
                onMouseEnter={e=>{e.target.style.background='rgba(255,0,80,0.22)';e.target.style.boxShadow='0 0 28px rgba(255,0,80,0.4)';}}
                onMouseLeave={e=>{e.target.style.background='rgba(255,0,80,0.1)';e.target.style.boxShadow='0 0 20px rgba(255,0,80,0.2)';}}
              >
                JOIN NOW
              </button>
            </motion.div>

            {/* vs */}
            <motion.div
              initial={{ opacity:0, scale:0.5 }}
              whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }}
              transition={{ duration:0.5, delay:0.3 }}
              style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'2.5rem',color:'rgba(255,255,255,0.1)',letterSpacing:'0.2em' }}
            >
              VS
            </motion.div>

            {/* Teal Diamond */}
            <motion.div
              initial={{ opacity:0, x:60 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.7, delay:0.2 }}
              style={{ textAlign:'center' }}
            >
              <div style={{ display:'flex',justifyContent:'center',marginBottom:'2rem' }}>
                <OrigamiDiamond color="#00c8c0" size={150}/>
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.5rem',color:'#f0f0f0',letterSpacing:'0.12em',marginBottom:'0.3rem' }}>
                WILL YOU GO TEAL?
              </div>
              <p style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:'0.78rem',color:'rgba(255,255,255,0.35)',letterSpacing:'0.06em',marginBottom:'1rem' }}>
                Tech. Code. E-Sports. Where logic meets chaos.
              </p>
              <button style={{
                fontFamily:"'Orbitron',monospace",fontSize:'0.65rem',fontWeight:700,
                padding:'10px 28px',border:'1.5px solid #00fff0',borderRadius:4,
                color:'#00fff0',background:'rgba(0,255,240,0.08)',cursor:'none',
                letterSpacing:'0.2em',transition:'all 0.25s',
                boxShadow:'0 0 20px rgba(0,255,240,0.2)',
              }}
                onMouseEnter={e=>{e.target.style.background='rgba(0,255,240,0.18)';e.target.style.boxShadow='0 0 28px rgba(0,255,240,0.4)';}}
                onMouseLeave={e=>{e.target.style.background='rgba(0,255,240,0.08)';e.target.style.boxShadow='0 0 20px rgba(0,255,240,0.2)';}}
              >
                JOIN NOW
              </button>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SCHEDULE SECTION
        ══════════════════════════════════════════════ */}
        <section style={{ background:'rgba(6,6,8,0.99)', padding:'5rem 3rem 8rem', position:'relative' }}>

          {/* Section header */}
          <motion.div
            initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }}
            viewport={{ once:true }} transition={{ duration:0.6 }}
            style={{ textAlign:'center', marginBottom:'3.5rem' }}
          >
            <div className="section-eyebrow" style={{ justifyContent:'center', marginBottom:'1rem' }}>GAME SCHEDULE</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2rem,6vw,4.5rem)',letterSpacing:'0.08em',color:'#f0f0f0' }}>
              THE <span style={{ color:'#ff0050',filter:'drop-shadow(0 0 20px rgba(255,0,80,0.4))' }}>ROUNDS</span>
            </div>
          </motion.div>

          {/* Day selector */}
          <div style={{ display:'flex',justifyContent:'center',gap:'0.9rem',marginBottom:'3rem',flexWrap:'wrap' }}>
            {DAYS.map((day) => {
              const isActive = activeDay === day.label;
              return (
                <motion.button
                  key={day.label}
                  onClick={() => setActiveDay(day.label)}
                  className={`day-tab ${isActive ? day.tabCls : ''}`}
                  whileTap={{ scale:0.97 }}
                >
                  <DayShapeIcon shape={day.shape} color={day.color} active={isActive} size={44}/>
                  <span style={{
                    fontFamily:"'Orbitron',monospace",fontSize:'0.74rem',fontWeight:700,
                    letterSpacing:'0.12em',transition:'color 0.3s',
                    color: isActive ? day.color : 'rgba(255,255,255,0.22)',
                  }}>
                    {day.label}
                  </span>
                  <span style={{
                    fontFamily:"'Rajdhani',sans-serif",fontSize:'0.6rem',fontWeight:700,
                    letterSpacing:'0.3em',transition:'color 0.3s',
                    color: isActive ? day.color+'99' : 'rgba(255,255,255,0.12)',
                  }}>
                    {day.sub}
                  </span>
                  <span style={{
                    fontFamily:"'Rajdhani',sans-serif",fontSize:'0.58rem',
                    letterSpacing:'0.04em', fontStyle:'italic',
                    color: isActive ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.08)',
                    transition:'color 0.3s',
                  }}>
                    "{day.quote}"
                  </span>
                  {isActive && (
                    <motion.div layoutId="tabLine"
                      style={{
                        position:'absolute',bottom:-1,left:'16%',right:'16%',height:2,borderRadius:1,
                        background:`linear-gradient(90deg, transparent, ${day.color}, transparent)`,
                        boxShadow:`0 0 10px ${day.color}66`,
                      }}
                      transition={{ type:'spring', bounce:0.32, duration:0.5 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Stats bar */}
          <div style={{ maxWidth:1180,margin:'0 auto 2rem',display:'flex',alignItems:'center',gap:'1.2rem',paddingBottom:'1.4rem',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'2.2rem',color:activeDayCfg.color,lineHeight:1 }}>
              {filtered.length}
            </span>
            <span style={{ fontFamily:"'Orbitron',monospace",fontSize:'0.6rem',color:'rgba(255,255,255,0.2)',letterSpacing:'0.28em',paddingBottom:4 }}>
              EVENTS
            </span>
            <div style={{ width:1,height:20,background:'rgba(255,255,255,0.08)' }}/>
            <span style={{ fontFamily:"'Orbitron',monospace",fontSize:'0.58rem',color:activeDayCfg.color+'88',letterSpacing:'0.2em' }}>
              {activeDayCfg.label} · {activeDayCfg.sub}
            </span>
            <div style={{ flex:1,height:1,background:`linear-gradient(90deg, ${activeDayCfg.color}33, transparent)` }}/>
          </div>

          {/* Grid */}
          <div style={{ maxWidth:1180, margin:'0 auto' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:0.18 }}
                className="ev-grid"
              >
                {filtered.map((ev, i) => <EventCard key={ev.id} event={ev} index={i}/>)}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SURVIVAL BANNER
        ══════════════════════════════════════════════ */}
        <section style={{
          position:'relative', overflow:'hidden',
          padding:'5rem 3rem',
          background:'linear-gradient(135deg, rgba(255,0,80,0.08) 0%, rgba(0,0,0,0.98) 40%, rgba(0,255,240,0.05) 100%)',
          borderTop:'1px solid rgba(255,255,255,0.04)',
          borderBottom:'1px solid rgba(255,255,255,0.04)',
        }}>
          <NeonBars/>
          {/* Big faded text */}
          <div style={{
            position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',
            fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(5rem,20vw,14rem)',
            color:'transparent', WebkitTextStroke:'1px rgba(255,255,255,0.03)',
            letterSpacing:'0.2em', pointerEvents:'none', userSelect:'none', zIndex:0,
          }}>
            SURVIVE
          </div>

          <div style={{ position:'relative',zIndex:2,textAlign:'center' }}>
            <motion.div
              initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }}
              viewport={{ once:true }} transition={{ duration:0.7 }}
            >
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(1.5rem,5vw,3.5rem)',color:'rgba(255,255,255,0.9)',letterSpacing:'0.1em',lineHeight:1.1,marginBottom:'1.2rem' }}>
                DO YOU HAVE WHAT IT TAKES<br/>
                <span className="neon-text" style={{ color:'#ff0050' }}>TO SURVIVE?</span>
              </div>
              <p style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:'1rem',color:'rgba(255,255,255,0.35)',maxWidth:500,margin:'0 auto 2.5rem',letterSpacing:'0.06em',lineHeight:1.7 }}>
                Once you step into the arena, there is no turning back. The winner stands alone. Every performance is a fight. Every note is a gamble.
              </p>
              <div style={{ display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap' }}>
                <button style={{
                  fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'0.22em',
                  padding:'14px 36px',background:'#ff0050',color:'white',border:'none',
                  borderRadius:4,cursor:'none',boxShadow:'0 0 32px rgba(255,0,80,0.4)',
                  transition:'all 0.25s',
                }}
                  onMouseEnter={e=>{e.target.style.transform='translateY(-3px)';e.target.style.boxShadow='0 0 50px rgba(255,0,80,0.6)';}}
                  onMouseLeave={e=>{e.target.style.transform='translateY(0)';e.target.style.boxShadow='0 0 32px rgba(255,0,80,0.4)';}}
                >
                  REGISTER NOW
                </button>
                <button style={{
                  fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'0.22em',
                  padding:'14px 36px',background:'transparent',color:'#00fff0',
                  border:'1.5px solid #00fff0',borderRadius:4,cursor:'none',
                  boxShadow:'0 0 20px rgba(0,255,240,0.2)',transition:'all 0.25s',
                }}
                  onMouseEnter={e=>{e.target.style.background='rgba(0,255,240,0.1)';e.target.style.boxShadow='0 0 32px rgba(0,255,240,0.4)';}}
                  onMouseLeave={e=>{e.target.style.background='transparent';e.target.style.boxShadow='0 0 20px rgba(0,255,240,0.2)';}}
                >
                  VIEW RULES
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════ */}
        <footer style={{ background:'#030305', padding:'2.5rem 3rem', borderTop:'1px solid rgba(255,0,80,0.06)' }}>
          <div style={{ maxWidth:1180,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem' }}>
            <div style={{ display:'flex',alignItems:'center',gap:10 }}>
              <svg width="22" height="22" viewBox="0 0 46 46">
                <circle cx="10" cy="23" r="7" stroke="rgba(255,0,80,0.3)" strokeWidth="2" fill="none"/>
                <polygon points="28,16 40,36 16,36" stroke="rgba(0,255,240,0.3)" strokeWidth="2" fill="none"/>
                <rect x="34" y="15" width="12" height="12" stroke="rgba(245,166,35,0.3)" strokeWidth="2" fill="none"/>
              </svg>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'0.9rem',letterSpacing:'0.3em',color:'rgba(255,255,255,0.15)' }}>AURA 2026</span>
            </div>
            <p style={{ fontFamily:"'Orbitron',monospace",fontSize:'0.48rem',color:'rgba(255,255,255,0.1)',letterSpacing:'0.22em',textAlign:'center' }}>
              ONCE YOU START THE GAME, THERE IS NO TURNING BACK
            </p>
            <span style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:'0.7rem',color:'rgba(255,255,255,0.1)',letterSpacing:'0.1em' }}>
              Cultural Fest · Tech Fest · All Events Subject to Change
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
