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
        // Premium Dark Palette (Walrus-inspired but refined)
        walrus: {
          dark: {
            950: '#050505', // Deepest black
            900: '#0A0A0A', // Main background
            800: '#121212', // Secondary background
            700: '#1A1A1A', // Panels / Cards
            600: '#262626', // Borders
          },
          cyan: '#00E0FF', // Vibrant Cyan
          purple: '#7C3AED', // Deep Purple
          pink: '#F472B6', // Soft Pink
          blue: '#3B82F6', // Standard Blue
        },
        // Legacy support (mapped to new palette where possible)
        'sui-cyan': '#00E0FF',
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'], // Unify heading font with sans for professional look
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        tech: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
