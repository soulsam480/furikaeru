import { ref, readonly } from 'vue';
import { io as Io, Socket } from 'socket.io-client';

let io: Socket;
const isConnected = ref(false);

export function createWs() {
  io = Io(import.meta.env.VITE_WSS, {
    path: '/furikaeru/ws',
  });

  io.on('connect', () => {
    isConnected.value = true;
  });

  io.on('connect_error', () => {
    isConnected.value = false;
  });

  io.on('connect_failed', () => {
    isConnected.value = false;
  });

  io.on('reconnect', () => {
    isConnected.value = true;
  });

  return io;
}

export function useIo() {
  return {
    io,
    emit: (ev: string, ...args: any[]) => io.emit(ev, ...args),
    on: (ev: string, listener: (...args: any[]) => void) => io.on(ev, listener),
    isConnected: readonly(isConnected),
  };
}
