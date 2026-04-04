/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        festival: {
          primary: '#D9D9D9',
          secondary: '#7D7D7D',
          accent: '#000000',
          bg: '#D9D9D9',
          card: '#FFFFFF',
          text: '#000000',
          muted: '#7D7D7D',
        },
      },
    },
  },
  plugins: [],
};
