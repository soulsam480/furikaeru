import { App } from 'vue';
import { io as Io, Socket } from 'socket.io-client';
let io: Socket;

export function createWs(app: App) {
  io = Io(import.meta.env.VITE_WSS, {
    path: '/furikaeru/ws/',
  });

  io.on('connect', () => {
    console.log('Socket connected!');
  });

  io.on('pong', () => {
    console.log('pong');
  });

  setInterval(() => {
    console.log('ping');
    io.emit('ping');
  }, 10000);

  app.config.globalProperties.$io = io;
  return io;
}

export function useIo() {
  return {
    io,
    emit: (ev: string, ...args: any[]) => io.emit(ev, ...args),
    on: (ev: string, listener: (...args: any[]) => void) => io.on(ev, listener),
  };
}
