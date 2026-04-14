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
      fontFamily: {
        sans: ['Roboto', 'Pretendard Variable', 'Pretendard', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        pretendard: ['Pretendard Variable', 'Pretendard', 'sans-serif'],
      },
      colors: {
        festival: {
          'primary-dark': '#010070',
          primary: '#0D00FF',
          lavender: '#E0DCFF',
          pink: '#FFBEBF',
          surface: '#D9D9D9',
          card: '#FFFFFF',
          text: '#000000',
          muted: '#7D7D7D',
          'muted-dark': '#515151',
        },
      },
      borderRadius: {
        'chip': '14.5px',
        'pill': '16px',
        'card': '15px',
        'card-lg': '20px',
        'card-xl': '25px',
        'sheet': '20px',
        'sheet-lg': '36px',
      },
    },
  },
  plugins: [],
};
