/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic System (The "Proper" Way)
        surface: {
          DEFAULT: 'var(--bg-main)',
          panel: 'var(--bg-panel)',
          card: 'var(--bg-card)',
        },
        content: {
          DEFAULT: 'var(--text-main)',
          muted: 'var(--text-muted)',
        },
        border: {
          DEFAULT: 'var(--border-main)',
        },
        brand: {
          DEFAULT: 'var(--accent-primary)',
        },

        // Premium Dark Palette (Keeping specific values for untokenized edge cases)
        walrus: {
          dark: {
            950: '#050505',
            900: '#0A0A0A',
            800: '#121212',
            700: '#1A1A1A',
            600: '#262626',
          },
          cyan: '#00E0FF',
          purple: '#7C3AED',
          pink: '#F472B6',
          blue: '#3B82F6',
        },
        // Legacy/Compat mappings
        'sui-cyan': 'var(--accent-primary)', // Now semantic!
        'dark-header': '#0A0A0A',
        'dark-bg': '#050505',
        'dark-surface': '#121212',
        'dark-panel': '#1A1A1A',
        'dark-border': '#262626',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(to right, #00E0FF, #7C3AED)',
        'gradient-premium': 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)',
        'gradient-glow': 'radial-gradient(circle at center, rgba(0, 224, 255, 0.1) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 224, 255, 0.3)',
        'neon-lg': '0 0 20px rgba(0, 224, 255, 0.4)',
        'premium': '0 4px 20px rgba(0, 0, 0, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        heading: ['Nunito', 'sans-serif'],
        secondary: ['Nunito', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'monospace'],
        display: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
