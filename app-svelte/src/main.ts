import App from './App.svelte';
import { createWs } from 'src/utils/ws';
import { registerSW } from 'virtual:pwa-register';

import './style/index.css';
import '@purge-icons/generated';

registerSW({
  immediate: true,
});

createWs();

const app = new App({
  target: document.getElementById('app'),
});

export default app;
