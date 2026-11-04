/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0B0F',
          secondary: '#111117',
          card: '#17171F',
          elevated: '#20202A',
        },
        gold: {
          DEFAULT: '#D4AF37',
          highlight: '#F4D477',
          dark: '#A68018',
          glow: 'rgba(212, 175, 55, 0.25)',
        },
        casino: {
          text: '#F5F5F5',
          muted: '#92929F',
          green: '#22C55E',
          red: '#EF4444',
          accent: '#FFB800',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px -3px rgba(212, 175, 55, 0.35)',
        'gold-glow-sm': '0 0 10px -2px rgba(212, 175, 55, 0.25)',
        'card-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F4D477 0%, #D4AF37 50%, #A68018 100%)',
        'gold-gradient-hover': 'linear-gradient(135deg, #FFE89E 0%, #E6C24E 50%, #BA9225 100%)',
        'card-gradient': 'linear-gradient(180deg, #1A1A24 0%, #121219 100%)',
        'casino-radial': 'radial-gradient(circle at top, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
      }
    },
  },
  plugins: [],
}

