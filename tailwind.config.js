/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sui-cyan': '#3CB9FF',
        'sui-blue': '#4DA2FF',
        'dark-bg': '#0B0F14',
        'dark-surface': '#151B23',
        'dark-border': '#1F2937',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
