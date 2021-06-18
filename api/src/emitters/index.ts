import { Board } from 'src/entities/board';
import { BoardColumn, SocketWithUser } from 'src/utils/types';

export function createEmitters(sock: SocketWithUser) {
  return {
    async createSendBoard(data: { data: BoardColumn[]; is_public: boolean }) {
      const { user } = sock;
      if (!user) return sock.emit('error', new Error('Unauthorized !'));

      const createdBoard = await Board.create({ data: data.data, user: user, is_public: data.is_public }).save();

      sock.emit('created:board', { d: createdBoard });
    },
    async sendAllBoards() {
      const { user } = sock;
      if (!user) return sock.emit('error', new Error('Unauthorized !'));
      const userBoards = await Board.find({ user: user });
      sock.emit('send-all:board', { d: userBoards });
    },
  };
}
