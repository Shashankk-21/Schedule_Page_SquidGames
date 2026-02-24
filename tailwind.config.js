/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'squid-black': '#121212',
        'squid-darker': '#0a0a0a',
        'squid-pink': '#ed1b76',       // Squid Game Pink
        'squid-pink-alt': '#ff0050',   // Alt Pink/Red
        'squid-pink-dim': 'rgba(255,0,80,0.18)',
        'squid-pink-glow': 'rgba(255,0,80,0.4)',
        'squid-teal': '#249f9c',       // Tracksuit Teal
        'squid-teal-alt': '#00fff0',   // Vibrant Teal
        'squid-teal-dim': 'rgba(0,255,240,0.15)',
        'squid-teal-glow': 'rgba(0,255,240,0.35)',
        'squid-amber': '#f5a623',
        'squid-magenta': '#e91e8c',
        'squid-gold': '#ffd700',
        'squid-purple': '#9b59b6',
        'squid-green': '#00ff88',
        'squid-red': '#ff2233',
        'squid-gray': '#3a3a3a',
        'squid-surface': 'rgba(10,10,14,0.92)',
        'squid-border': 'rgba(255,255,255,0.06)',
        'squid-border-hi': 'rgba(255,255,255,0.12)',
        'squid-text': '#f0f0f0',
        'squid-muted': 'rgba(255,255,255,0.38)',
        'squid-dim': 'rgba(255,255,255,0.14)',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        saira: ['"Saira Stencil One"', 'sans-serif'],
      },
      backgroundImage: {
        'squid-gradient': 'linear-gradient(to bottom, #121212, #0a0a0a)',
        'neon-gradient': 'linear-gradient(45deg, #ed1b76, #249f9c)',
      },
      boxShadow: {
        'neon-pink': '0 0 10px #ed1b76, 0 0 20px #ed1b76',
        'neon-teal': '0 0 10px #249f9c, 0 0 20px #249f9c',
      },
      animation: {
        'flicker': 'flicker 2s infinite',
        'pulse-glow': 'pulse-glow 3s infinite',
        'glitch': 'glitch 1s infinite linear alternate-reverse',
        'tick': 'tick 55s linear infinite',
        'bar-flicker': 'bar-flicker 3s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 4s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2.5s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: 0.99 },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: 0.4 },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(237, 27, 118, 0.5)' },
          '50%': { boxShadow: '0 0 25px rgba(237, 27, 118, 0.8)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        tick: {
          'from': { transform: 'translateX(100vw)' },
          'to': { transform: 'translateX(-100%)' },
        },
        'bar-flicker': {
          '0%, 100%': { opacity: 'var(--base-op, 0.5)' },
          '48%': { opacity: 'var(--base-op, 0.5)' },
          '50%': { opacity: 0.15 },
          '52%': { opacity: 'var(--base-op, 0.5)' },
          '88%': { opacity: 'var(--base-op, 0.5)' },
          '90%': { opacity: 0.3 },
          '92%': { opacity: 'var(--base-op, 0.5)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'neon-pulse': {
          '0%, 100%': { textShadow: '0 0 10px var(--tw-colors-squid-pink), 0 0 24px var(--tw-colors-squid-pink-glow)' },
          '50%': { textShadow: '0 0 20px var(--tw-colors-squid-pink), 0 0 48px var(--tw-colors-squid-pink-glow), 0 0 80px rgba(255,0,80,0.15)' },
        },
      },
    },
  },
  plugins: [],
}
