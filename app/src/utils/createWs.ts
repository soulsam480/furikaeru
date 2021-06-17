import { App } from 'vue';
import { io as Io, Manager, Socket } from 'socket.io-client';
import { useUser } from 'src/store/user';
let io: Socket;
let baordIo: Socket;
let manager: Manager;

export function createWs(app: App) {
  manager = new Manager(import.meta.env.VITE_WSS, {
    path: '/furikaeru/ws',
  });

  io = manager.socket('/');

  io.on('connect', () => {
    console.log('Socket connected!');
  });

  io.on('pong', () => {
    console.log('pong');
  });

  setInterval(() => {
    console.log('ping');
    io.emit('ping');
  }, 60000);

  app.config.globalProperties.$io = io;
  return io;
}

export function createAuthWs() {
  const { getToken } = useUser();
  baordIo = manager.socket('/board', {
    auth: {
      Authorization: `Bearer ${getToken.value}`,
    },
  });
  return baordIo;
}

export function useIo() {
  return {
    io,
    emit: (ev: string, ...args: any[]) => io.emit(ev, ...args),
    on: (ev: string, listener: (...args: any[]) => void) => io.on(ev, listener),
  };
}
