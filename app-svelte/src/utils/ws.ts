import { io as Io, Socket } from 'socket.io-client';
import { writable } from 'svelte/store';

let io: Socket;

const isConnected = writable(false);

export function createWs() {
  io = Io(import.meta.env.VITE_WSS, {
    path: '/furikaeru/ws',
  });

  io.on('connect', () => {
    isConnected.set(true);
  });

  io.on('connect_error', () => {
    isConnected.set(false);
  });

  io.on('connect_failed', () => {
    isConnected.set(false);
  });

  io.on('reconnect', () => {
    isConnected.set(true);
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
