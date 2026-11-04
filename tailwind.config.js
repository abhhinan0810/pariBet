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
          DEFAULT: '#07080B',      // Deep obsidian pitch black
          secondary: '#0B0C10',    // Dark slate surface
          card: '#0E0F15',         // Minimalist card background
          elevated: '#12131A',     // Elevated card / modal
          hover: '#181A24',        // Hover slate
        },
        brand: {
          purple: '#F59E0B',       // Replaced with gold to maintain compatibility
          violet: '#F59E0B',       // Replaced with gold to maintain compatibility
          pink: '#FBBF24',         // Replaced with bright gold
          cyan: '#D97706',         // Replaced with deep gold
          blue: '#F59E0B',
          gold: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.25)',
        },
        gold: {
          DEFAULT: '#F59E0B',
          highlight: '#FDE68A',
          dark: '#D97706',
          glow: 'rgba(245, 158, 11, 0.35)',
        },
        casino: {
          text: '#F3F4F6',
          muted: '#94A3B8',
          green: '#10B981',
          red: '#EF4444',
          accent: '#F59E0B',
          gold: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'brand-glow': '0 0 25px -4px rgba(245, 158, 11, 0.35)',
        'pink-glow': '0 0 25px -4px rgba(245, 158, 11, 0.35)',
        'cyan-glow': '0 0 25px -4px rgba(245, 158, 11, 0.25)',
        'gold-glow': '0 0 25px -4px rgba(245, 158, 11, 0.45)',
        'card-glow': '0 12px 36px -10px rgba(0, 0, 0, 0.85)',
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
        'pink-gradient': 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
        'banner-gradient': 'linear-gradient(135deg, #181924 0%, #0E0F15 60%, #07080B 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(18, 19, 26, 0.95) 0%, rgba(11, 12, 16, 0.98) 100%)',
      }
    },
  },
  plugins: [],
}
