## Furikaeru component library

> A minimal component lib for personal projects

![npm](https://img.shields.io/npm/v/furikaeru) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/furikaeru) ![GitHub](https://img.shields.io/github/license/soulsam480/furikaeru) ![npm](https://img.shields.io/npm/dm/furikaeru)

## Note
Due to a vue bug https://github.com/vuejs/vue-next/issues/4783, boolean props are breaking, please expect some issues. thx

#### Features
- Tree shaked
- fully typed [@johnsoncodehk/volar](https://github.com/johnsoncodehk/volar)
- fully customizable @windicss, @antfu/vite-plugin-windicss
- Icons powered by @antfu/vite-plugin-purge-icons

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
__install peer dependencies__
- vue@next
- @iconify/iconify@latest
- @iconify/json@latest
- vite-plugin-purge-icons@latest
- click-outside-vue3@latest
- vite-plugin-windicss@latest
- windicss@latest

__config__

- add to windi config
```ts
// a safelist preset of some of the color classes, use this or import individual configs
// and extend. see lib/src/windi/index.ts

import { furiWindiSafelist } from 'furikaeru'

export default defineConfig({
  safelist: [...furiWindiSafelist],
  extract: { include: ['./node_modules/furikaeru/dist/*'] },
});
```
- import CSS (very small one)
```ts
import 'furikaeru/dist/style.css';
```
- register click-outside directive
```ts
import vClickOutside from 'click-outside-vue3';

app.use(vClickOutside);
```

#### Caution
even after doing all these, there might be some issues, I'm advising not use this for your projects. Thx