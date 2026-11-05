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
          DEFAULT: '#07080B',                           // Deep obsidian pitch black
          secondary: 'rgba(11, 12, 18, 0.75)',          // Translucent dark slate surface
          card: 'rgba(12, 13, 20, 0.65)',               // Translucent blurred card background
          elevated: 'rgba(18, 20, 30, 0.55)',           // Translucent blurred elevated box
          hover: 'rgba(28, 30, 44, 0.65)',              // Hover translucent slate
        },
        brand: {
          purple: '#EF4444',       // Crimson red accent
          violet: '#DC2626',       // Deep casino red
          pink: '#F87171',         // Ruby highlight
          cyan: '#B91C1C',         // Dark velvet crimson
          blue: '#EF4444',
          gold: '#F59E0B',
          glow: 'rgba(239, 68, 68, 0.35)',
        },
        gold: {
          DEFAULT: '#F59E0B',
          highlight: '#FDE68A',
          dark: '#D97706',
          glow: 'rgba(239, 68, 68, 0.35)',
        },
        casino: {
          text: '#F3F4F6',
          muted: '#94A3B8',
          green: '#10B981',
          red: '#EF4444',
          accent: '#EF4444',
          gold: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'brand-glow': '0 0 25px -4px rgba(220, 38, 38, 0.45)',
        'red-glow': '0 0 28px -4px rgba(239, 68, 68, 0.55)',
        'pink-glow': '0 0 25px -4px rgba(220, 38, 38, 0.35)',
        'cyan-glow': '0 0 25px -4px rgba(220, 38, 38, 0.3)',
        'gold-glow': '0 0 25px -4px rgba(253, 250, 65, 0.97)',
        'card-glow': '0 12px 36px -10px rgba(0, 0, 0, 0.85), 0 0 24px -6px rgba(220, 38, 38, 0.25)',
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #EF4444 0%, #B91C1C 50%, #7F1D1D 100%)',
        'pink-gradient': 'linear-gradient(135deg, #F87171 0%, #DC2626 50%, #991B1B 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
        'red-gradient': 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #991B1B 100%)',
        'banner-gradient': 'linear-gradient(135deg, #1C0F13 0%, #0E0F15 60%, #07080B 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(22, 13, 17, 0.95) 0%, rgba(11, 10, 14, 0.98) 100%)',
      }
    },
  },
  plugins: [],
}
