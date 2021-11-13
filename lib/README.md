## Furikaeru component library

> A minimal component lib for personal projects

![npm](https://img.shields.io/npm/v/furikaeru) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/furikaeru) ![GitHub](https://img.shields.io/github/license/soulsam480/furikaeru) ![npm](https://img.shields.io/npm/dm/furikaeru)

## Note
Due to a vue bug https://github.com/vuejs/vue-next/issues/4783, boolean props are breaking, please expect some issues. thx

#### Features
- Tree shaked
- fully typed [@volar](https://github.com/johnsoncodehk/volar)
- fully customizable -> WindiCSS
- Icons powered by iconify

#### Based on 
- Vue 3 
- Vite
- WindiCSS
- TypeScript
- Iconify

#### Usage
> please don't skip following steps

__install__

```
yarn add furikaeru

npm install furikaeru

pnpm add furikaeru
```
__install dependencies__
- "@iconify/iconify": "^2.0.4",
- "vue": "^3.2.20",
- "@iconify/json": "^1.1.415",
- "windicss": "^3.1.9",

__config__

- add to windi config
```ts
// cyan is default color so needed, add others as per requirement
// used in color prop
const COLORS = ['red', 'green', 'purple', 'indigo', 'cyan', 'amber', 'lime'];

const BG_COLOR = {
  key: 'bg',
  set: [500, 400, 300, 50, 200, 100].map((el) => COLORS.map((c) => `${c}-${el}`)).flat(),
};

const HOVER_BG_COLOR = {
  key: 'hover:bg',
  set: [300, 400].map((r) => COLORS.map((c) => `${c}-${r}`)).flat(),
};

function generateSafeList(config) {
  return config.map((el) => el.set.map((s) => `${el.key}-${s}`));
}

export default defineConfig({
  safelist: generateSafeList([HOVER_BG_COLOR, BG_COLOR]),
  extract: { include: ['./node_modules/furikaeru/dist/*'] },
});
```
- import CSS (very small one)
```ts
import 'furikaeru/dist/style.css';
```
