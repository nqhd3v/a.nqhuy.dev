const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.tsx",
    "./components/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'dark-100': '#6695ff',
        'dark-200': '#5b84e0',
        'dark-300': '#587ed4',
        'dark-400': '#4969b0',
        'dark-500': '#33487a',
        'dark-600': '#273962',
        'dark-700': '#213155',
        'dark-800': '#192541',
        'dark': '#0f172a',
        'light': '#ffffff'
      },
      width: {
        '18': '72px',
        '20': '80px'
      },
      height: {
        '18': '72px',
        '20': '80px'
      }
    },
  },
  plugins: [
    plugin(function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'translate-z': (value) => ({
            '--tw-translate-z': value,
            transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
          }), // this is actual CSS
        },
        { values: theme('translate'), supportsNegativeValues: true }
      )
    })
  ],
  darkMode: 'class',
}
