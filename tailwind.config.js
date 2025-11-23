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
        'dark-bg': '#1e2433',
        'dark-surface': '#252b3b',
        'dark-border': '#334155',
        'dark-header': '#2d3748',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
