import { createApp } from 'vue';
import App from 'src/App.vue';
import 'virtual:windi.css';
import '@purge-icons/generated';
import { createWs } from 'src/utils/createWs';

const app = createApp(App);
createWs(app);
app.mount('#app');
