import { io as Io, Socket } from 'socket.io-client';

let io: Socket;
let isConnected = false;

export function createWs() {
  io = Io(import.meta.env.VITE_WSS, {
    path: '/furikaeru/ws',
  });

  io.on('connect', () => {
    isConnected = true;
  });

  io.on('connect_error', () => {
    isConnected = false;
  });

  io.on('connect_failed', () => {
    isConnected = false;
  });

  io.on('reconnect', () => {
    isConnected = true;
  });

  return io;
}

export function useIo() {
  return {
    io,
    emit: (ev: string, ...args: any[]) => io.emit(ev, ...args),
    on: (ev: string, listener: (...args: any[]) => void) => io.on(ev, listener),
    isConnected,
  };
}
