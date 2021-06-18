import { Server } from 'socket.io';
import { createEmitters } from 'src/emitters';
import { BoardColumn, SocketWithUser } from 'src/utils/types';

export function createListeners(io: Server) {
  io.on('connection', (sock: SocketWithUser) => {
    console.log('From home ++ Socket Connected');

    sock.on('ping', () => {
      sock.emit('pong');
    });

    sock.on('error', (err) => {
      console.log(err);
    });

    sock.on('create:board', async (data: { data: BoardColumn[]; is_public: boolean }) => {
      await createEmitters(sock).createSendBoard(data);
    });

    sock.on('get-all:board', async () => {
      await createEmitters(sock).sendAllBoards();
    });
  });
}
