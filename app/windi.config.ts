// windi.config.ts
import { defineConfig } from 'windicss/helpers';
import formsPlugin from 'windicss/plugin/forms';
import { furiWindiSafelist } from 'furikaeru';

export default defineConfig({
  darkMode: 'class',
  safelist: [...furiWindiSafelist],
  theme: {
    extend: {
      transitionProperty: {
        height: 'height',
      },
    },
  },
  plugins: [formsPlugin],
});
