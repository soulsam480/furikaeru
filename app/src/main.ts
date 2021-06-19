import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from 'src/App.vue';
import 'virtual:windi.css';
import '@purge-icons/generated';
import { Router } from 'src/router';
import 'src/styles/index.scss';
import { createWs } from 'src/utils/createWs';

const app = createApp(App);
app.use(createPinia());
app.use(Router);
createWs();
app.mount('#app');
