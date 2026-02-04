/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{jsx,js,tsx}', './src/**/*.{js,ts,jsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00BFA5', // Teal - Main Action
          light: '#E0F2F1',   // Light Teal - Accents
          dark: '#009688',
        },
        background: '#F5F7FA',
        surface: '#FFFFFF',
        text: {
          primary: '#1F2937', // Gray 800
          secondary: '#6B7280', // Gray 500
        }
      }
    },
  },
  plugins: [],
};
