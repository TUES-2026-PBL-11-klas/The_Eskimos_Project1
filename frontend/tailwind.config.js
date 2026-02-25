/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tmdb: {
          dark:   '#032541',
          darker: '#0d253f',
          accent: '#01b4e4',
          green:  '#90cea1',
        },
      },
      backgroundImage: {
        'rating-gradient': 'conic-gradient(var(--rating-color) var(--rating-pct), #204529 0)',
      },
    },
  },
  plugins: [],
};
