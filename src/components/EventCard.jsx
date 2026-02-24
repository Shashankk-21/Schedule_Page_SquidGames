import { useMemo } from 'react';
import { motion } from 'framer-motion';
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
  const style = glow ? { filter: `drop-shadow(0 0 6px ${color})` } : {};
  if(shape==='circle')
    return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" fill="none"/></svg>;
  if(shape==='triangle')
    return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><polygon points="12,3 22,21 2,21" stroke={color} strokeWidth="2.5" fill="none"/></svg>;
  return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><rect x="3" y="3" width="18" height="18" stroke={color} strokeWidth="2.5" fill="none"/></svg>;
};

// Subtle watermark
const WaterMark = ({ shape, color }) => {
  const style = { position:'absolute',right:-12,bottom:-12,opacity:0.055,pointerEvents:'none',zIndex:0,transition:'opacity 0.35s' };
  if(shape==='circle')
    return <svg style={style} width={100} height={100} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="6" fill="none"/>
      <circle cx="50" cy="50" r="32" stroke={color} strokeWidth="2.5" fill="none" opacity=".55"/>
    </svg>;
  if(shape==='triangle')
    return <svg style={style} width={100} height={100} viewBox="0 0 100 100">
      <polygon points="50,7 93,87 7,87" stroke={color} strokeWidth="6" fill="none"/>
      <polygon points="50,24 78,78 22,78" stroke={color} strokeWidth="2.5" fill="none" opacity=".55"/>
    </svg>;
  return <svg style={style} width={100} height={100} viewBox="0 0 100 100">
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
  const accentColor = status==='live' ? '#00ff88'  : status==='done' ? '#1a0000' : cfg.color;

  // Custom Styles handled via Tailwind and inline style for dynamic colors
  return (
    <motion.div
      initial={{ opacity:0, y:30, scale:0.95 }}
      animate={{ opacity:1, y:0,  scale:1 }}
      exit={{   opacity:0, y:-18, scale:0.96 }}
      transition={{ duration:0.4, delay:index*0.07, ease:[0.22,1,0.36,1] }}
    >
      <SpotlightCard
        className={`h-full flex flex-col ${status==='live' ? 'border-[rgba(0,255,136,0.4)] animate-pulse-glow shadow-[0_0_20px_rgba(0,255,136,0.1)]' : ''} ${status==='done' ? 'opacity-40 grayscale-[0.8] brightness-75' : ''}`}
        spotlightColor={spotColor}
        style={{ borderColor }}
      >
        {/* Gradient bg overlay per category */}
        <div className="absolute inset-0 z-0 rounded-xl" style={{ background: cfg.gradient }} />

        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] z-[4] rounded-l-xl"
          style={{
            background:`linear-gradient(180deg,${accentColor},${accentColor}44)`,
            boxShadow: status==='live' ? `2px 0 14px ${accentColor}66` : 'none',
          }}
        />

        {/* Watermark */}
        <WaterMark shape={cfg.shape} color={cfg.color}/>

        {/* Live progress bar */}
        {status==='live' && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[rgba(0,255,136,0.1)] z-[4]">
            <div
              className="h-full bg-gradient-to-r from-squid-green to-[#00ffcc] shadow-[0_0_8px_var(--tw-colors-squid-green)] transition-[width] duration-500 ease-linear"
              style={{width:`${progress*100}%`}}
            />
          </div>
        )}

        {/* Card body */}
        <div className="relative z-[2] p-6 pl-7 h-full flex flex-col">

          {/* Top: category pill + status */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded border"
              style={{ background: cfg.bg, borderColor: `${cfg.color}2e` }}
            >
              <Icon size={11} color={cfg.color} strokeWidth={2.5}/>
              <span className="font-rajdhani text-[0.65rem] font-bold tracking-[0.16em]" style={{ color: cfg.color }}>
                {cfg.label}
              </span>
            </div>

            {status==='live' && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-squid-green shadow-[0_0_8px_#00ff88] animate-blink inline-block"/>
                <span className="font-orbitron text-[0.55rem] text-squid-green font-bold tracking-[0.14em]">LIVE</span>
              </div>
            )}
            {status==='done' && (
              <span className="font-orbitron text-[0.5rem] font-black tracking-[0.26em] text-squid-red border border-squid-red/30 px-1.5 py-0.5 rounded opacity-80">
                DONE
              </span>
            )}
            {status==='upcoming' && (
              <span className="font-orbitron text-[0.5rem] text-white/20 tracking-[0.18em]">UPCOMING</span>
            )}
          </div>

          {/* Event name */}
          <h3
            className="font-bebas text-xl md:text-2xl font-normal tracking-wide leading-none mb-3"
            style={{
              color: status==='done' ? 'rgba(255,255,255,0.32)' : '#f0f0f0',
              textDecoration: status==='done' ? 'line-through' : 'none',
              textDecorationColor: 'rgba(255,34,51,0.55)',
            }}
          >
            {event.eventName}
          </h3>

          {/* Time + venue */}
          <div className="flex flex-col gap-1.5 mb-4 flex-grow">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-white/25" strokeWidth={2}/>
              <span className="font-rajdhani text-[0.82rem] text-white/50 font-medium">
                {event.startTime} – {event.endTime}
              </span>
              {status==='live' && (
                <span className="font-orbitron text-[0.48rem] text-squid-green ml-auto tracking-widest">
                  {Math.round(progress*100)}%
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-white/25" strokeWidth={2}/>
              <span className="font-rajdhani text-[0.82rem] text-white/50 font-medium">
                {event.venue}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
            <ShapeIcon
              shape={cfg.shape}
              color={status==='live'?'#00ff88':status==='done'?'rgba(255,255,255,0.1)':cfg.color}
              size={14}
              glow={status==='live'}
            />
            <span className="font-orbitron text-[0.5rem] text-white/10 tracking-[0.22em]">
              PLAYER #{playerNum(event.id)}
            </span>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

export default EventCard;
