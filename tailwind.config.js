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
        // Walrus-inspired dark palette
        walrus: {
          dark: {
            900: '#0B0F14',
            800: '#12171D',
            700: '#1A1F26',
            600: '#232930',
          },
          cyan: '#3CB9FF',
          purple: '#6366F1',
          pink: '#A855F7',
          violet: '#8B5CF6',
          blue: '#4DA2FF',
        },
        // Legacy sui colors (keeping for compatibility)
        'sui-cyan': '#00D4FF',
        // Deprecated neo colors (will remove after migration)
        'neo-bg': '#F0F0F0',
        'neo-black': '#000000',
        'neo-white': '#FFFFFF',
        'neo-primary': '#FF6B6B',
        'neo-secondary': '#4ECDC4',
        'neo-accent': '#FFE66D',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 0deg at 50% 50%, var(--tw-gradient-stops))',
        'walrus-glow': 'conic-gradient(from 0deg at 50% 50%, #3CB9FF 0deg, #6366F1 120deg, #A855F7 240deg, #3CB9FF 360deg)',
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #000000',
        'neo-lg': '8px 8px 0px 0px #000000',
        'neo-sm': '2px 2px 0px 0px #000000',
        'glow': '0 0 30px -10px rgba(60, 185, 255, 0.3)',
        'glow-lg': '0 0 50px -10px rgba(60, 185, 255, 0.5)',
        'glow-purple': '0 0 30px -10px rgba(99, 102, 241, 0.3)',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Space Grotesk', 'Inter', 'sans-serif'],
        display: ['Syne', 'Space Grotesk', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      animation: {
        'spin-slower': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
