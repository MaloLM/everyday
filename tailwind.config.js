/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      margin: {
        '68': '17rem', 
        '76': '19rem', 
      },
      maxHeight: {
        '106': '28rem', 
        '108': '30rem',
        '110': '32rem',
        '112': '34rem',
        '114': '36rem',
        '116': '38rem',
        '118': '40rem',
        '120': '42rem',
        '122': '44rem',
        '124': '46rem',
      },
      minHeight: {
        '106': '28rem', 
        '108': '30rem',
        '110': '32rem',
        '112': '34rem',
        '114': '36rem',
        '116': '38rem',
        '118': '40rem',
        '120': '42rem',
        '122': '44rem',
        '124': '46rem',
      },
      colors: {
        nobleBlack: '#0B0B0B',
        lightNobleBlack: '#1a1a1a',
        secondaryLightNobleBlack: '#1e1e1e',
        nobleGold: '#d4b85b',
        darkerNobleGold: '#dec049',
        secondaryGold: '#fef250',
        lightGray: '#333333',
        softWhite: '#d6d6d6',
        error: '#d10000',
        succesGreen: '#34d399',
      },
    },
  },
  plugins: [],
}
