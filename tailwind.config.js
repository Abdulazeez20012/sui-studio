/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sui-cyan': '#00D4FF',
        'sui-blue': '#4DA2FF',
        'neon-purple': '#B026FF',
        'neon-pink': '#FF006E',
        'neon-green': '#00FF94',
        'dark-bg': '#0A0E14',
        'dark-surface': '#0F1419',
        'dark-panel': '#151A21',
        'dark-border': '#1F2937',
        'dark-header': '#0D1117',
        'accent-glow': 'rgba(0, 212, 255, 0.15)',
      },
      backgroundImage: {
        'gradient-web3': 'linear-gradient(135deg, #0A0E14 0%, #1a1f2e 100%)',
        'gradient-neon': 'linear-gradient(90deg, #00D4FF 0%, #B026FF 100%)',
        'gradient-cyber': 'linear-gradient(135deg, #00D4FF 0%, #B026FF 50%, #FF006E 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 212, 255, 0.3)',
        'neon-lg': '0 0 30px rgba(0, 212, 255, 0.4)',
        'purple-glow': '0 0 20px rgba(176, 38, 255, 0.3)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
