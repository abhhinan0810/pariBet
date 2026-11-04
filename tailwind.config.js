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
          DEFAULT: '#090616',      // Deep midnight obsidian purple
          secondary: '#0E0924',    // Dark purple surface
          card: '#140D33',         // Rich card background
          elevated: '#1D1347',     // Elevated card
          hover: '#241857',
        },
        brand: {
          purple: '#8B5CF6',
          violet: '#A855F7',
          pink: '#EC4899',
          cyan: '#06B6D4',
          blue: '#3B82F6',
          gold: '#F59E0B',
          glow: 'rgba(139, 92, 246, 0.35)',
        },
        gold: {
          DEFAULT: '#F59E0B',
          highlight: '#FBBF24',
          dark: '#D97706',
          glow: 'rgba(245, 158, 11, 0.35)',
        },
        casino: {
          text: '#F8FAFC',
          muted: '#94A3B8',
          green: '#10B981',
          red: '#EF4444',
          accent: '#A855F7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'brand-glow': '0 0 25px -4px rgba(139, 92, 246, 0.45)',
        'pink-glow': '0 0 25px -4px rgba(236, 72, 153, 0.45)',
        'cyan-glow': '0 0 25px -4px rgba(6, 182, 212, 0.45)',
        'gold-glow': '0 0 20px -3px rgba(245, 158, 11, 0.45)',
        'card-glow': '0 12px 36px -10px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #4C1D95 100%)',
        'pink-gradient': 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
        'banner-gradient': 'linear-gradient(135deg, #2A175B 0%, #170F3A 60%, #0E0924 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(29, 19, 71, 0.8) 0%, rgba(14, 9, 36, 0.95) 100%)',
      }
    },
  },
  plugins: [],
}
