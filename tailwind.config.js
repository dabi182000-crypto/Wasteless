/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#f5f5f5', dark: '#0a0a0a' },
        surface: { DEFAULT: '#ffffff', dark: '#1a1a1a' },
        border: { DEFAULT: '#e5e5e5', dark: '#262626' },
        muted: { DEFAULT: '#737373', dark: '#a3a3a3' },
        accent: {
          DEFAULT: '#e63946',
          hover: '#d62b39',
        },
        ink: { DEFAULT: '#0a0a0a', dark: '#ffffff' },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.08)',
        'card-dark': '0 1px 3px rgba(0,0,0,0.4)',
        glow: '0 0 0 4px rgba(230, 57, 70, 0.15)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
