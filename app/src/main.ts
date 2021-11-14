import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from 'src/App.vue';
import 'virtual:windi.css';
import '@purge-icons/generated';
import { Router } from 'src/router';
import 'src/styles/index.scss';
import 'furikaeru/dist/style.css';
import { createWs } from 'src/utils/createWs';
//@ts-ignore
import vClickOutside from 'click-outside-vue3';
import { registerSW } from 'virtual:pwa-register';
import { createHead } from '@vueuse/head';

registerSW({
  immediate: true,
});

const app = createApp(App);

app.use(createPinia());
app.use(Router);

createWs();

app.use(vClickOutside);
app.use(createHead());

app.mount('#app');
