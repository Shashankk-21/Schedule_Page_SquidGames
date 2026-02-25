import { useMemo } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { MapPin, Clock, Gamepad2, Trophy, Mic2, Shirt, Zap, Star } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

// ── Category palette ─────────────────────────────
const CAT = {
  'E-Sports':  {
    Icon: Gamepad2, color: '#00fff0', bg: 'rgba(0,255,240,0.07)',
    shape: 'circle',   spot: 'rgba(0,255,240,0.22)',
    gradient: 'linear-gradient(135deg, rgba(0,255,240,0.12) 0%, rgba(0,60,60,0.2) 100%)',
    label: 'E-SPORTS',
  },
  'Dramatics': {
    Icon: Star,     color: '#ff0050', bg: 'rgba(255,0,80,0.07)',
    shape: 'triangle', spot: 'rgba(255,0,80,0.22)',
    gradient: 'linear-gradient(135deg, rgba(255,0,80,0.12) 0%, rgba(60,0,20,0.2) 100%)',
    label: 'DRAMATICS',
  },
  'Fashion': {
    Icon: Shirt,    color: '#f5a623', bg: 'rgba(245,166,35,0.07)',
    shape: 'square',   spot: 'rgba(245,166,35,0.22)',
    gradient: 'linear-gradient(135deg, rgba(245,166,35,0.12) 0%, rgba(60,40,0,0.2) 100%)',
    label: 'FASHION',
  },
  'Specials': {
    Icon: Zap,      color: '#c084fc', bg: 'rgba(192,132,252,0.07)',
    shape: 'circle',   spot: 'rgba(192,132,252,0.22)',
    gradient: 'linear-gradient(135deg, rgba(192,132,252,0.12) 0%, rgba(40,0,60,0.2) 100%)',
    label: 'SPECIALS',
  },
  'Technical': {
    Icon: Trophy,   color: '#00fff0', bg: 'rgba(0,255,240,0.07)',
    shape: 'triangle', spot: 'rgba(0,255,240,0.22)',
    gradient: 'linear-gradient(135deg, rgba(0,255,240,0.12) 0%, rgba(0,40,50,0.2) 100%)',
    label: 'TECHNICAL',
  },
  'Music': {
    Icon: Mic2,     color: '#ff0050', bg: 'rgba(255,0,80,0.07)',
    shape: 'square',   spot: 'rgba(255,0,80,0.22)',
    gradient: 'linear-gradient(135deg, rgba(255,0,80,0.12) 0%, rgba(60,0,20,0.2) 100%)',
    label: 'MUSIC',
  },
};

const DAY_DATES = { 'Day 0':'2026-02-24','Day 1':'2026-02-25','Day 2':'2026-02-26' };

const parseT = (ts, ds) => {
  const [t,m] = ts.split(' ');
  let [h,min] = t.split(':').map(Number);
  if(m==='PM'&&h!==12) h+=12;
  if(m==='AM'&&h===12) h=0;
  const d=new Date(ds); d.setHours(h,min,0,0); return d;
};

const getStatus = (event) => {
  const now = new Date();
  const s   = parseT(event.startTime, DAY_DATES[event.day]);
  const e   = parseT(event.endTime,   DAY_DATES[event.day]);
  if(now>=s&&now<=e) return 'live';
  if(now>e)          return 'done';
  return 'upcoming';
};

const getProgress = (event) => {
  const now = new Date();
  const s   = parseT(event.startTime, DAY_DATES[event.day]);
  const e   = parseT(event.endTime,   DAY_DATES[event.day]);
  return Math.min(1, Math.max(0, (now-s)/(e-s)));
};

// Mini shape icons
const ShapeIcon = ({ shape, color, size=14, glow=false }) => {
  const f = glow ? `drop-shadow(0 0 6px ${color})` : 'none';
  if(shape==='circle')
    return <svg width={size} height={size} viewBox="0 0 24 24" style={{filter:f}}><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" fill="none"/></svg>;
  if(shape==='triangle')
    return <svg width={size} height={size} viewBox="0 0 24 24" style={{filter:f}}><polygon points="12,3 22,21 2,21" stroke={color} strokeWidth="2.5" fill="none"/></svg>;
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{filter:f}}><rect x="3" y="3" width="18" height="18" stroke={color} strokeWidth="2.5" fill="none"/></svg>;
};

// Subtle watermark
const WaterMark = ({ shape, color }) => {
  const s = { position:'absolute',right:-12,bottom:-12,opacity:0.055,pointerEvents:'none',zIndex:0,transition:'opacity 0.35s' };
  if(shape==='circle')
    return <svg style={s} width={100} height={100} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="6" fill="none"/>
      <circle cx="50" cy="50" r="32" stroke={color} strokeWidth="2.5" fill="none" opacity=".55"/>
    </svg>;
  if(shape==='triangle')
    return <svg style={s} width={100} height={100} viewBox="0 0 100 100">
      <polygon points="50,7 93,87 7,87" stroke={color} strokeWidth="6" fill="none"/>
      <polygon points="50,24 78,78 22,78" stroke={color} strokeWidth="2.5" fill="none" opacity=".55"/>
    </svg>;
  return <svg style={s} width={100} height={100} viewBox="0 0 100 100">
    <rect x="6" y="6" width="88" height="88" stroke={color} strokeWidth="6" fill="none"/>
    <rect x="22" y="22" width="56" height="56" stroke={color} strokeWidth="2.5" fill="none" opacity=".55"/>
  </svg>;
};

const playerNum = (id) => String(parseInt(id.replace('e',''),10)*37+100).padStart(3,'0');

const EventCard = ({ event, index }) => {
  const status   = useMemo(() => getStatus(event), [event]);
  const progress = status==='live' ? getProgress(event) : 0;
  const cfg      = CAT[event.category] || CAT['Specials'];
  const { Icon } = cfg;

  const borderColor = status==='live' ? 'rgba(0,255,136,0.45)' : status==='done' ? 'rgba(255,34,51,0.1)' : 'rgba(255,255,255,0.07)';
  const spotColor   = status==='live' ? 'rgba(0,255,136,0.22)' : status==='done' ? 'rgba(0,0,0,0)' : cfg.spot;
  const cardCls     = status==='live' ? 'card-live' : status==='done' ? 'card-done' : '';
  const accentColor = status==='live' ? '#00ff88'  : status==='done' ? '#1a0000' : cfg.color;

  return (
    <motion.div
      initial={{ opacity:0, y:36, scale:0.95 }}
      animate={{ opacity:1, y:0,  scale:1 }}
      exit={{   opacity:0, y:-18, scale:0.96 }}
      transition={{ duration:0.5, delay:index*0.07, ease:[0.22,1,0.36,1] }}
    >
      <SpotlightCard
        className={cardCls}
        spotlightColor={spotColor}
        style={{ borderColor }}
      >
        {/* Gradient bg overlay per category */}
        <div style={{ position:'absolute',inset:0,background:cfg.gradient,zIndex:0,borderRadius:12 }} />

        {/* Left accent bar */}
        <div style={{
          position:'absolute',left:0,top:0,bottom:0,width:3,zIndex:4,borderRadius:'12px 0 0 12px',
          background:`linear-gradient(180deg,${accentColor},${accentColor}44)`,
          boxShadow: status==='live' ? `2px 0 14px ${accentColor}66` : 'none',
        }}/>

        {/* Watermark */}
        <WaterMark shape={cfg.shape} color={cfg.color}/>

        {/* Live progress bar */}
        {status==='live' && (
          <div className="prog-track">
            <div className="prog-fill" style={{width:`${progress*100}%`}}/>
          </div>
        )}

        {/* Card body */}
        <div style={{ position:'relative',zIndex:2,padding:'1.5rem 1.4rem 1.4rem 1.7rem' }}>

          {/* Top: category pill + status */}
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.9rem' }}>
            <div style={{
              display:'flex',alignItems:'center',gap:5,
              background:cfg.bg, border:`1px solid ${cfg.color}2e`,
              borderRadius:4,padding:'3px 10px',
            }}>
              <Icon size={11} color={cfg.color} strokeWidth={2.5}/>
              <span style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:'0.65rem',fontWeight:700,color:cfg.color,letterSpacing:'0.16em' }}>
                {cfg.label}
              </span>
            </div>

            {status==='live' && (
              <div style={{ display:'flex',alignItems:'center',gap:5 }}>
                <span style={{ width:7,height:7,borderRadius:'50%',background:'#00ff88',boxShadow:'0 0 8px #00ff88',display:'inline-block' }} className="blink"/>
                <span style={{ fontFamily:"'Orbitron',monospace",fontSize:'0.55rem',color:'#00ff88',fontWeight:700,letterSpacing:'0.14em' }}>LIVE</span>
              </div>
            )}
            {status==='done' && <span className="elim-stamp">DONE</span>}
            {status==='upcoming' && (
              <span style={{ fontFamily:"'Orbitron',monospace",fontSize:'0.5rem',color:'rgba(255,255,255,0.18)',letterSpacing:'0.18em' }}>UPCOMING</span>
            )}
          </div>

          {/* Event name */}
          <h3 style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:'clamp(1.1rem,2vw,1.3rem)',
            fontWeight:400, letterSpacing:'0.06em',
            color: status==='done' ? 'rgba(255,255,255,0.32)' : '#f0f0f0',
            lineHeight:1.2, marginBottom:'0.8rem',
            textDecoration: status==='done' ? 'line-through' : 'none',
            textDecorationColor:'rgba(255,34,51,0.55)',
          }}>
            {event.eventName}
          </h3>

          {/* Time + venue */}
          <div style={{ display:'flex',flexDirection:'column',gap:'0.35rem',marginBottom:'1rem' }}>
            <div style={{ display:'flex',alignItems:'center',gap:7 }}>
              <Clock size={12} color="rgba(255,255,255,0.25)" strokeWidth={2}/>
              <span style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:'0.82rem',color:'rgba(255,255,255,0.5)',fontWeight:500 }}>
                {event.startTime} – {event.endTime}
              </span>
              {status==='live' && (
                <span style={{ fontFamily:"'Orbitron',monospace",fontSize:'0.48rem',color:'#00ff88',marginLeft:'auto',letterSpacing:'0.1em' }}>
                  {Math.round(progress*100)}%
                </span>
              )}
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:7 }}>
              <MapPin size={12} color="rgba(255,255,255,0.25)" strokeWidth={2}/>
              <span style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:'0.82rem',color:'rgba(255,255,255,0.5)',fontWeight:500 }}>
                {event.venue}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display:'flex',alignItems:'center',justifyContent:'space-between',
            paddingTop:'0.7rem',borderTop:'1px solid rgba(255,255,255,0.06)',
          }}>
            <ShapeIcon
              shape={cfg.shape}
              color={status==='live'?'#00ff88':status==='done'?'rgba(255,255,255,0.1)':cfg.color}
              size={14}
              glow={status==='live'}
            />
            <span style={{ fontFamily:"'Orbitron',monospace",fontSize:'0.5rem',color:'rgba(255,255,255,0.12)',letterSpacing:'0.22em' }}>
              PLAYER #{playerNum(event.id)}
            </span>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

export default EventCard;
