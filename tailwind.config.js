/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eaf4ff",
          100: "#d1e6fb",
          200: "#9bc8f2",
          300: "#5aa0e6",
          400: "#3b82d6",
          500: "#1c6fc2",
          600: "#0059b3",
          700: "#004a94",
          800: "#004387",
          900: "#00366f",
        },
        sand: {
          50: "#fcf6ea",
          100: "#f8ead5",
          200: "#f3dcc0",
          300: "#eccca2",
          400: "#d9b88f",
          500: "#c29a73",
          600: "#a57b54",
          700: "#8e6844",
          800: "#765536",
          900: "#5f4527",
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale': 'scale 0.2s ease-out',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale': {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
    },
  },
  plugins: [],
}