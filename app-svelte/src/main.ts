import App from './App.svelte';
import { createWs } from 'src/utils/ws';

import 'virtual:windi.css';
import '@purge-icons/generated';
import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
});

createWs();

const app = new App({
  target: document.getElementById('app'),
});

export default app;
