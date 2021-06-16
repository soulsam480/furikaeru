import { createApp } from 'vue';
import App from 'src/App.vue';
import 'virtual:windi.css';
import '@purge-icons/generated';

import { io } from 'socket.io-client';

const Sock = io(import.meta.env.VITE_WSS, {
  path: '/furikaeru/ws',
});

Sock.on('connect', () => {
  console.log(Sock.connected);
  console.log('connected!');
  Sock.emit('ping');
});

Sock.on('pong', () => {
  console.log('pong');
});

createApp(App).mount('#app');
