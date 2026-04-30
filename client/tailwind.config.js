/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        'gradient-start': '#667eea',
        'gradient-end': '#764ba2',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
    },
  },
  safelist: [
    { pattern: /bg-(rose|amber|emerald|blue|indigo|violet|cyan|teal)-(50|100|200)/ },
    { pattern: /text-(rose|amber|emerald|blue|indigo|violet|cyan|teal)-(400|500|600|700)/ },
    { pattern: /ring-(rose|amber|emerald|blue|indigo|violet|cyan)-(100|200)/ },
    { pattern: /shadow-(rose|amber|emerald|indigo|violet)-(200)/ },
  ],
  plugins: [],
};
