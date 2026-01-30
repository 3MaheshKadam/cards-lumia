/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{jsx,js,tsx}', './src/**/*.{js,ts,jsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
