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
          50: '#fee6e7',
          100: '#fecdcf',
          200: '#fd9b9f',
          300: '#fd696f',
          400: '#fd484f', // Main brand color
          500: '#fc262e',
          600: '#e11017',
          700: '#b80d14',
          800: '#900a10',
          900: '#68080c',
        },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'nav': '0 -2px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
