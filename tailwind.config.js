const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F9FA',
        gray: {
          50: '#F7F9FA',
          100: '#E6E8EB',
          200: '#AFB2B1',
          500: '#808080',
          800: '#494D4B',
        },
        green: {
          500: '#04D361',
        },
        purple: {
          300: '#9F75FF',
          400: '#9164FA',
          500: '#8256E5',
          800: '#6F48C9',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Lexend', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        panel: '0 25px 60px rgba(15, 23, 42, 0.08)',
        card: '0 20px 40px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
};
