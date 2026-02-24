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
        'squid-teal': '#249f9c',       // Tracksuit Teal
        'squid-teal-alt': '#00fff0',   // Vibrant Teal
        'squid-gray': '#3a3a3a',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
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
      },
    },
  },
  plugins: [],
}
