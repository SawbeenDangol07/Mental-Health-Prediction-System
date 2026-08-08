/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        normal: {
          light: '#10b981',
          DEFAULT: '#059669',
          dark: '#047857',
          bg: '#ecfdf5',
          darkBg: '#064e3b'
        },
        depression: {
          light: '#6366f1',
          DEFAULT: '#4f46e5',
          dark: '#4338ca',
          bg: '#eef2ff',
          darkBg: '#1e1b4b'
        },
        anxiety: {
          light: '#f59e0b',
          DEFAULT: '#d97706',
          dark: '#b45309',
          bg: '#fffbeb',
          darkBg: '#451a03'
        },
        bipolar: {
          light: '#a855f7',
          DEFAULT: '#9333ea',
          dark: '#7e22ce',
          bg: '#faf5ff',
          darkBg: '#3b0764'
        },
        suicidal: {
          light: '#f43f5e',
          DEFAULT: '#e11d48',
          dark: '#be123c',
          bg: '#fff1f2',
          darkBg: '#4c0519'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
