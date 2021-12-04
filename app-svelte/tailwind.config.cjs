// const { furiWindiSafelist } = require('furikaeru');

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.html', './src/**/*.svelte', './index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['cupcake', 'dark'],
  },
};
