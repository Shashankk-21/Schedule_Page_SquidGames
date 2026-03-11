import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplineLoader({ onComplete }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Show loader for 5.5 seconds to allow scene to load and play
    const timer = setTimeout(() => {
      handleExit();
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  const handleExit = () => {
    setShow(false);
    setTimeout(() => {
      if(onComplete) onComplete();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#060608] flex flex-col items-center justify-center"
        >
           {/* Iframe Container */}
           <div className="w-full h-full relative">
             <iframe
               src="https://my.spline.design/squidgamelogo-PtuSbCgPXtb5oMnMgd9EKwvG/"
               frameBorder="0"
               width="100%"
               height="100%"
               className="w-full h-full pointer-events-none select-none"
               title="Intro"
             />

             {/* Interaction Shield */}
             <div className="absolute inset-0 bg-transparent" />
           </div>

           {/* Skip/Enter Button */}
           <motion.button
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 2.5, duration: 0.8 }}
             onClick={handleExit}
             className="absolute bottom-12 px-8 py-3 border border-squid-pink/30 bg-black/40 text-squid-pink font-orbitron text-xs tracking-[0.3em] hover:bg-squid-pink hover:text-white transition-all duration-300 z-10 backdrop-blur-md uppercase"
           >
             Enter Arena
           </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
