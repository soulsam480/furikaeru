import { Server } from 'socket.io';
import { createEmitters } from 'src/emitters';
import { Board } from 'src/entities/board';
import { upVote } from 'src/services/board';
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

    // sock.on('create:board', async (data: { data: BoardColumn[]; is_public: boolean }) => {
    //   await createEmitters(sock).createSendBoard(data);
    // });

    // sock.on('get-all:board', async () => {
    //   await createEmitters(sock).sendAllBoards();
    // });

    sock.on('get:board', async (d: { id: string }) => {
      const { id: roommId } = d;
      const board = await Board.findOne({ id: roommId });
      if (!board) return sock.emit('error', new Error('Board not found'));
      if (!board.is_public) return sock.emit('error', new Error('Private board'));

      sock.join(roommId);
      io.sockets.in(roommId).emit('send:board', { d: board });

      sock.on('up-vote:board', async (d: { id: string; uid: string; coid: string; cid: string }) => {
        const { id, coid, cid, uid } = d;
        const board = await Board.findOne({ id });

        const column = board?.data.filter((el) => el.id === coid)[0];
        if (!column) return sock.emit('error', new Error('Column not found'));

        let card = column.data.filter((el) => el.id === cid)[0];
        if (!card) return sock.emit('error', new Error('Card not found'));

        card = upVote(card, uid);

        column.data.splice(
          column.data.findIndex((el) => el.id === card.id),
          0,
          { ...card },
        );

        board?.data.splice(
          board.data.findIndex((el) => el.id === column.id),
          0,
          { ...column },
        );

        await Board.update(id, { data: board?.data });
        io.sockets.in(roommId).emit('send:board', { d: await Board.find({ id }) });
      });
    });
  });
}
