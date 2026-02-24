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
        'squid-pink': '#ed1b76',
        'squid-pink-alt': '#ff0050',
        'squid-teal': '#249f9c',
        'squid-teal-alt': '#00fff0',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      backgroundImage: {
        'squid-gradient': 'linear-gradient(to bottom, #121212, #0a0a0a)',
      },
    },
  },
  plugins: [],
}
