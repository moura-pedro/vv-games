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
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
    },
  },
  plugins: [],
}