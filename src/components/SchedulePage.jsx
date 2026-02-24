import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import Background3D from './Background3D';
import SplineHero from './SplineHero';
import GlitchText from './GlitchText';
import EventCard from './EventCard';

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
  { label:'Day 0', sub:'QUALIFIER', shape:'circle',   color:'#ff0050', tabBg:'bg-squid-pink-dim', border:'border-squid-pink', shadow:'shadow-neon-pink', quote:'The opening move.' },
  { label:'Day 1', sub:'ARENA',     shape:'triangle', color:'#00fff0', tabBg:'bg-squid-teal-dim', border:'border-squid-teal', shadow:'shadow-neon-teal', quote:'The battle peaks.' },
  { label:'Day 2', sub:'FINALE',    shape:'square',   color:'#f5a623', tabBg:'bg-squid-amber/10', border:'border-squid-amber', shadow:'shadow-[0_0_20px_rgba(245,166,35,0.4)]', quote:'Only one survives.' },
];

const TICKER_TEXT = '◯  AURA 2026 CULTURAL FEST  △  THE GAMES BEGIN  □  456 CONTESTANTS  ◯  FASHION · MUSIC · DRAMA · TECH · E-SPORTS  △  ONCE YOU START THERE IS NO TURNING BACK  □  MAY THE BEST SURVIVE  ◯  RED LIGHT — FREEZE  △  GREEN LIGHT — PERFORM  □  VIOLATORS WILL BE ELIMINATED  ◯  ';

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

// ─── Main Page ────────────────────────────────────
export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState('Day 0');
  const [now, setNow]             = useState(new Date());
  const [isNavScrolled, setNavScrolled] = useState(false);

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

  return (
    <>
      <div className="cursor-dot"/>
      <div className="cursor-ring"/>
      <div className="scanlines"/>

      {/* ── Three.js BG (Bloom/Stars) ──────────────────────────────── */}
      <Background3D/>

      <div className="relative z-[2] min-h-screen">

        {/* ══════════════════════════════════════════════
            NAVBAR
        ══════════════════════════════════════════════ */}
        <nav
          className={clsx(
            "fixed top-0 left-0 right-0 z-[1000] px-6 md:px-12 py-5 flex items-center justify-between transition-all duration-300 backdrop-blur-md",
            isNavScrolled
              ? "bg-[#060608]/95 border-b border-squid-pink/10 shadow-lg"
              : "bg-gradient-to-b from-[#060608]/90 to-transparent border-b border-transparent"
          )}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 46 46">
              <circle cx="10" cy="23" r="7" stroke="#ff0050" strokeWidth="2" fill="none"/>
              <polygon points="28,16 40,36 16,36" stroke="#00fff0" strokeWidth="2" fill="none"/>
              <rect x="34" y="15" width="12" height="12" stroke="#f5a623" strokeWidth="2" fill="none"/>
            </svg>
            <span className="font-bebas text-2xl md:text-3xl tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-squid-pink to-squid-teal">
              AURA 2026
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex gap-10 items-center">
            {['ABOUT','EVENTS','ARENAS','SCHEDULE'].map(l => (
              <button key={l} className="font-rajdhani text-xs font-bold text-squid-muted tracking-[0.22em] uppercase bg-none border-none transition-all hover:text-squid-pink hover:shadow-[0_0_12px_var(--tw-colors-squid-pink-glow)]">
                {l}
              </button>
            ))}
            <div className="font-orbitron text-[0.6rem] font-bold px-3 py-1 border border-squid-pink text-squid-pink tracking-[0.2em] rounded bg-squid-pink-dim shadow-[0_0_14px_rgba(255,0,80,0.4)] animate-pulse">
              LIVE
            </div>
          </div>
        </nav>

        {/* ══════════════════════════════════════════════
            TICKER
        ══════════════════════════════════════════════ */}
        <div className="fixed top-[72px] left-0 right-0 z-[900] overflow-hidden whitespace-nowrap bg-squid-pink/5 border-y border-squid-pink/10 py-2 pointer-events-none">
          <div className="inline-block animate-tick">
            <span className="font-orbitron text-[0.56rem] text-squid-pink/70 tracking-[0.18em] font-semibold px-4">
              {TICKER_TEXT} {TICKER_TEXT}
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════ */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-6 relative overflow-hidden">

          {/* Content */}
          <div className="relative z-[3] text-center w-full max-w-5xl">

            {/* SPLINE LOGO */}
            <motion.div
              initial={{ opacity:0, scale:0.8 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ duration:1.2, ease:"easeOut" }}
              className="w-full flex justify-center mb-8 md:mb-0"
            >
              <SplineHero />
            </motion.div>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity:0, letterSpacing:'1.5em' }}
              animate={{ opacity:1, letterSpacing:'0.42em' }}
              transition={{ duration:1.8, ease:'easeOut' }}
              className="font-orbitron text-[0.6rem] text-squid-pink/50 font-bold mb-8 uppercase"
            >
              ◯ &nbsp;△ &nbsp;□ &nbsp;·&nbsp; THE CULTURAL GAMES &nbsp;·&nbsp; ◯ &nbsp;△ &nbsp;□
            </motion.div>

            {/* Main title */}
            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.9, delay:0.2, ease:[0.22,1,0.36,1] }}
              className="relative mb-6"
            >
              {/* SCHEDULE glitch */}
              <div className="text-[clamp(3.5rem,12vw,9rem)] relative z-[2] leading-none">
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
              className="mb-12"
            >
              <div className="font-bebas text-[clamp(1.2rem,4vw,2rem)] text-white/55 tracking-[0.3em]">
                THREE DAYS. TWELVE ARENAS. ONE WINNER.
              </div>
            </motion.div>

            {/* Live clock */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }}
              className="animate-flicker mb-2"
            >
              <div className="font-orbitron text-[clamp(1.5rem,5vw,3rem)] font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-squid-pink to-squid-magenta inline-block">
                {clockStr}
              </div>
            </motion.div>
            <div className="font-rajdhani text-xs text-white/20 tracking-[0.38em] uppercase">
              IST · LIVE CLOCK
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:1.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2"
          >
            <div className="font-orbitron text-[0.5rem] text-white/20 tracking-[0.3em]">SCROLL</div>
            <svg width="18" height="28" viewBox="0 0 18 28">
              <rect x="1" y="1" width="16" height="26" rx="8" stroke="rgba(255,0,80,0.35)" strokeWidth="1.5" fill="none"/>
              <motion.circle cx="9" cy="8" r="3" fill="#ff0050" animate={{cy:[8,18,8]}} transition={{repeat:Infinity,duration:1.8}} />
            </svg>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════
            SCHEDULE SECTION
        ══════════════════════════════════════════════ */}
        <section className="bg-squid-black/95 py-20 px-6 relative border-t border-squid-border-hi">

          {/* Section header */}
          <motion.div
            initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }}
            viewport={{ once:true }} transition={{ duration:0.6 }}
            className="text-center mb-16"
          >
            <div className="font-orbitron text-[0.58rem] font-bold tracking-[0.45em] text-squid-pink uppercase flex items-center justify-center gap-3 mb-4 before:content-[''] before:h-px before:w-12 before:bg-gradient-to-r before:from-transparent before:to-squid-pink after:content-[''] after:h-px after:w-12 after:bg-gradient-to-l after:from-transparent after:to-squid-pink">
              GAME SCHEDULE
            </div>
            <div className="font-bebas text-[clamp(2.5rem,7vw,5rem)] tracking-widest text-squid-text leading-none">
              THE <span className="text-squid-pink drop-shadow-[0_0_20px_rgba(255,0,80,0.4)]">ROUNDS</span>
            </div>
          </motion.div>

          {/* Day selector */}
          <div className="flex justify-center gap-4 md:gap-6 mb-12 flex-wrap">
            {DAYS.map((day) => {
              const isActive = activeDay === day.label;
              return (
                <motion.button
                  key={day.label}
                  onClick={() => setActiveDay(day.label)}
                  className={clsx(
                    "relative outline-none cursor-none overflow-hidden rounded-xl border-[1.5px] p-6 md:p-8 min-w-[140px] md:min-w-[160px] flex flex-col items-center gap-2 transition-all duration-300",
                    isActive
                      ? `${day.tabBg} ${day.border} ${day.shadow}`
                      : "bg-transparent border-squid-border-hi hover:border-white/20 hover:bg-white/5 hover:-translate-y-1"
                  )}
                  whileTap={{ scale:0.97 }}
                >
                  <DayShapeIcon shape={day.shape} color={day.color} active={isActive} size={44}/>
                  <span
                    className={clsx(
                      "font-orbitron text-xs font-bold tracking-[0.12em] transition-colors duration-300",
                      isActive ? "text-[color:var(--c)]" : "text-white/20"
                    )}
                    style={{ '--c': day.color }}
                  >
                    {day.label}
                  </span>
                  <span
                    className={clsx(
                      "font-rajdhani text-[0.6rem] font-bold tracking-[0.3em] transition-colors duration-300",
                      isActive ? "opacity-90" : "opacity-10"
                    )}
                    style={{ color: isActive ? day.color : 'white' }}
                  >
                    {day.sub}
                  </span>
                  <span className={clsx("font-rajdhani text-[0.58rem] tracking-wider italic transition-colors duration-300", isActive ? "text-white/40" : "text-white/10")}>
                    "{day.quote}"
                  </span>
                  {isActive && (
                    <motion.div layoutId="tabLine"
                      className="absolute bottom-0 left-[16%] right-[16%] h-[2px] rounded-full shadow-[0_0_10px_currentColor]"
                      style={{ background: day.color, color: day.color }}
                      transition={{ type:'spring', bounce:0.32, duration:0.5 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Stats bar */}
          <div className="max-w-6xl mx-auto mb-8 flex items-center gap-5 pb-5 border-b border-white/5">
            <span
              className="font-bebas text-4xl leading-none"
              style={{ color: activeDayCfg.color }}
            >
              {filtered.length}
            </span>
            <span className="font-orbitron text-[0.6rem] text-white/20 tracking-[0.28em] pt-1">
              EVENTS
            </span>
            <div className="w-px h-5 bg-white/10"/>
            <span
              className="font-orbitron text-[0.58rem] tracking-[0.2em]"
              style={{ color: `${activeDayCfg.color}88` }}
            >
              {activeDayCfg.label} · {activeDayCfg.sub}
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: `linear-gradient(90deg, ${activeDayCfg.color}33, transparent)` }}
            />
          </div>

          {/* Grid */}
          <div className="max-w-6xl mx-auto min-h-[50vh]">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((ev, i) => (
                  <EventCard key={ev.id} event={ev} index={i}/>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════ */}
        <footer className="bg-[#030305] py-10 px-6 border-t border-squid-pink/10">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 46 46">
                <circle cx="10" cy="23" r="7" stroke="rgba(255,0,80,0.3)" strokeWidth="2" fill="none"/>
                <polygon points="28,16 40,36 16,36" stroke="rgba(0,255,240,0.3)" strokeWidth="2" fill="none"/>
                <rect x="34" y="15" width="12" height="12" stroke="rgba(245,166,35,0.3)" strokeWidth="2" fill="none"/>
              </svg>
              <span className="font-bebas text-sm tracking-[0.3em] text-white/15">AURA 2026</span>
            </div>
            <p className="font-orbitron text-[0.48rem] text-white/10 tracking-[0.22em] text-center w-full md:w-auto order-3 md:order-2">
              ONCE YOU START THE GAME, THERE IS NO TURNING BACK
            </p>
            <span className="font-rajdhani text-xs text-white/10 tracking-widest order-2 md:order-3">
              Cultural Fest · Tech Fest · All Events Subject to Change
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
