import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const CountdownOverlay = ({ onComplete }) => {
  const [count, setCount] = useState(3);
  // shapeTypes moved outside or useMemo, but since it's constant:
  const shapeTypes = ['○', '△', '□'];

  // Initialize shapes purely on client side to avoid hydration mismatch if SSR
  // But to avoid "setState in useEffect" error, we can try lazy init.
  // However, random values causing hydration mismatch is worse than a double render.
  // We'll stick to useEffect but wrap in setTimeout to make it "async" enough or just ignore the error?
  // Better: use a ref to check mount? No.
  // Let's use the double-render pattern but allow it.

  const [shapesConfig, setShapesConfig] = useState([]);

  useEffect(() => {
    const newShapes = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      moveY: Math.random() * -100,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
      char: shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
    }));
    setShapesConfig(newShapes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Count is 0 -> Show "BEGIN"
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);


  const containerStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999, // Ensure it's on top
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    overflow: 'hidden',
    fontFamily: "'Orbitron', sans-serif"
  };

  const bgGradientStyle = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(255,0,80,0.2) 0%, #000 50%, rgba(0,255,240,0.2) 100%)',
  };

  const numberStyle = {
    fontSize: 'clamp(8rem, 25vw, 20rem)',
    fontWeight: 'bold',
    color: '#ff0050',
    filter: 'drop-shadow(0 0 30px rgba(255,0,80,0.8))'
  };

  const goStyle = {
    fontSize: 'clamp(4rem, 15vw, 10rem)',
    fontWeight: 'bold',
    color: '#00fff0',
    letterSpacing: '0.2em',
    filter: 'drop-shadow(0 0 30px rgba(0,255,240,0.8))'
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      style={containerStyle}
    >
      {/* Background Pulse Effect */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={bgGradientStyle}
      />

      {/* Floating Shapes Background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {shapesConfig.map((shape) => (
          <motion.div
            key={shape.id}
            initial={{
              x: shape.x,
              y: shape.y,
              opacity: 0,
            }}
            animate={{
              y: [null, shape.moveY],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              delay: shape.delay,
            }}
            style={{
              position: 'absolute',
              fontSize: '2rem',
              color: '#ff0050',
              opacity: 0.2
            }}
          >
            {shape.char}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1.5, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 2, opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            style={numberStyle}
          >
            {count}
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={goStyle}
          >
            BEGIN
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glitch Overlay Effect */}
      <div style={{
         position: 'absolute',
         inset: 0,
         pointerEvents: 'none',
         opacity: 0.1,
         backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")',
         mixBlendMode: 'overlay'
      }} />
    </motion.div>
  );
};

export default CountdownOverlay;
