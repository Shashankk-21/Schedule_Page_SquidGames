import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import GlitchText from './GlitchText';

const FogLayer = ({ delay = 0, duration = 20, className }) => (
  <motion.div
    animate={{ x: ["-5%", "5%", "-5%"], y: ["-5%", "5%", "-5%"], scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
    transition={{ duration, ease: "easeInOut", repeat: Infinity, delay }}
    className={`absolute inset-[-20%] blur-3xl mix-blend-screen pointer-events-none ${className}`}
  />
);

export default function RegistrationSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-32 bg-[#060608] border-t border-squid-pink/10">

      {/* Parallax Background Container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={{ y: yBg, scale: 1.15 }}
          className="w-full h-full relative"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: "url('/assets/guards-bg.png')" }}
          />
          {/* Gradients to blend edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-[#060608] opacity-90" />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </div>

      {/* Fog/Mist Layers - Cinematic Effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
         {/* Pinkish mist */}
         <FogLayer delay={0} duration={18} className="bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-squid-pink/10 via-transparent to-transparent" />
         {/* Tealish mist */}
         <FogLayer delay={6} duration={24} className="bg-gradient-to-br from-squid-teal/5 via-transparent to-transparent translate-x-20" />
         {/* Vignette */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#060608_90%)]" />
      </div>

      {/* Content */}
      <div className="relative z-[10] text-center w-full max-w-5xl px-6">

        {/* Animated Shapes Icon */}
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center gap-6 opacity-80"
        >
            <div className="w-10 h-10 border-[3px] border-squid-pink rounded-full drop-shadow-[0_0_10px_rgba(255,0,80,0.8)] animate-pulse" />
            <div className="w-10 h-10 border-[3px] border-squid-teal drop-shadow-[0_0_10px_rgba(0,255,240,0.8)] animate-pulse delay-100"
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="w-10 h-10 border-[3px] border-squid-amber drop-shadow-[0_0_10px_rgba(245,166,35,0.8)] animate-pulse delay-200" />
        </motion.div>

        {/* Eyebrow */}
        <motion.div
           initial={{ opacity: 0, letterSpacing: '1em' }}
           whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="font-orbitron text-squid-pink font-bold text-xs md:text-sm mb-6 uppercase drop-shadow-[0_0_8px_rgba(255,0,80,0.6)]"
        >
            Front Man is Watching You
        </motion.div>

        {/* Main Title */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="mb-12 relative inline-block"
        >
           <h2 className="font-bebas text-[clamp(4rem,12vw,9rem)] leading-[0.85] text-white tracking-widest relative z-[2] drop-shadow-lg">
             JOIN THE <br/>
             <GlitchText speed={0.6} className="text-squid-pink drop-shadow-[0_0_30px_rgba(255,0,80,0.5)]">
               GAME
             </GlitchText>
           </h2>
        </motion.div>

        <motion.p
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.4 }}
           className="font-rajdhani text-squid-muted text-lg md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed tracking-wider"
        >
           <span className="text-squid-teal">456 spots available.</span> The prize pool is accumulating. <br className="hidden md:block"/>
           Will you survive the night or be eliminated? <br className="hidden md:block"/>
           <span className="text-white font-semibold block mt-2">Enter your details to secure your position in the arena.</span>
        </motion.p>

        {/* CTA Button */}
        <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.6 }}
            className="group relative px-16 py-6 bg-transparent overflow-hidden isolate shadow-[0_0_30px_rgba(255,0,80,0.2)] hover:shadow-[0_0_50px_rgba(255,0,80,0.5)] transition-shadow duration-500"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
        >
            {/* Button BG */}
            <div className="absolute inset-0 bg-squid-pink/10 border border-squid-pink group-hover:bg-squid-pink/80 transition-all duration-300" />

            <span className="relative z-10 font-orbitron font-bold text-lg text-white tracking-[0.25em] group-hover:text-black transition-colors flex items-center justify-center gap-3">
              REGISTER NOW <span className="text-xl">→</span>
            </span>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-squid-pink opacity-80 group-hover:border-black transition-colors duration-300" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-squid-pink opacity-80 group-hover:border-black transition-colors duration-300" />
        </motion.button>

        {/* Status Text */}
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 1 }}
           className="mt-10 font-rajdhani text-xs text-squid-teal tracking-[0.3em] uppercase opacity-70"
        >
           Warning: Elimination is permanent
        </motion.div>
      </div>
    </section>
  );
}
