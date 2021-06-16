import { App } from '@vue/runtime-core';
import { io as Io, Socket } from 'socket.io-client';

let io: Socket;

export function createWs(app: App) {
  io = Io(import.meta.env.VITE_WSS, {
    path: '/furikaeru/ws/',
  });

  io.on('connect', () => {
    console.log('connected!');
    io.emit('ping');
  });

  io.on('pong', () => {
    console.log('pong');
  });

  setInterval(() => {
    io.emit('ping');
  }, 10000);

  app.config.globalProperties.$io = io;
  return io;
}

export function useIo() {
  return {
    io,
    emit: io.emit,
    on: io.on,
  };
}
