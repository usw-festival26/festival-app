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
        // 'Pretendard-Regular' = expo-font(useFonts) 가 self-host 한 family name.
        // 한글 환경(특히 노트북/Windows, Pretendard 미설치) 에서 jsdelivr CDN 의
        // 'Pretendard Variable' 가 로드 실패해도 self-host 폰트로 한글 보장.
        sans: ['Roboto', 'Pretendard-Regular', 'Pretendard Variable', 'Pretendard', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        pretendard: ['Pretendard-Regular', 'Pretendard Variable', 'Pretendard', 'sans-serif'],
      },
      colors: {
        festival: {
          'primary-dark': '#010070',
          primary: '#0068FF',
          'primary-light': '#C3EDFF',
          'secondary-from': '#A5FFF3',
          'secondary-to': '#0068FF',
          nav: '#70D4FF',
          lavender: '#E0DCFF',
          pink: '#FFBEBF',
          bright: '#FEF2FF',
          surface: '#D9D9D9',
          card: '#FFFFFF',
          text: '#000000',
          muted: '#7D7D7D',
          'muted-dark': '#515151',
          'error-red': '#FF3B30',
          'logo-purple': '#9B5A9A',
          'pin-cluster': '#0068FF',
          'pin-food': '#FF7A00',
          'pin-facility': '#22C55E',
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
