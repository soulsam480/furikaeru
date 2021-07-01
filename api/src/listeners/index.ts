import { Server, Socket } from 'socket.io';
import { Board } from 'src/entities/board';

export function createListeners(io: Server) {
  io.on('connection', (sock: Socket) => {
    console.log('From home ++ Socket Connected');

    sock.on('ping', () => {
      sock.emit('pong');
    });

    sock.on('error', (err) => {
      console.log(err);
    });

    sock.on('get:board', async (d: { id: string }) => {
      const { id: roomId } = d;
      try {
        const board = await Board.findOne({
          where: { id: roomId },
          relations: ['user'],
          loadRelationIds: true,
        });

        if (!board) return sock.emit('error', new Error('Board not found'));
        if (!board.is_public) return sock.emit('error', { error: new Error('Private board') });

        await sock.join(roomId);
        io.sockets.in(roomId).emit('send:board', { d: board });

        sock.on('update:board', async (d: { id: string; b: Partial<Board> }) => {
          const { id, b } = d;

          await Board.update(id, { data: b.data, title: b.title });
          const nb = await Board.findOne({ id });

          io.sockets.in(roomId).emit('send:board', { d: nb });
        });
      } catch (error) {
        return sock.emit('error', { error: new Error('Board not found') });
      }

      sock.on('leave:board', async () => {
        console.log('leave');
        try {
          await sock.leave(roomId);
        } catch (error) {
          console.log(error);
        }
      });

      sock.on('disconnect', async () => {
        console.log('leave');
        try {
          await sock.leave(roomId);
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
}
