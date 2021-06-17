import { SocketController, ConnectedSocket, MessageBody, OnMessage, OnConnect } from 'socket-controllers';
import { Board } from 'src/entities/board';
import { BoardColumn, SocketWithUser } from 'src/utils/types';
import { getRepository } from 'typeorm';

@SocketController('/board')
export class boardController {
  private readonly boardRepo = getRepository(Board);

  @OnMessage('ping')
  onPing(@ConnectedSocket() sock: SocketWithUser) {
    console.log(sock);
  }

  @OnMessage('create:board')
  async createBoard(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { data: BoardColumn[]; is_public: boolean },
  ) {
    const { user } = socket;
    const createdBoard = await this.boardRepo.create({ data: data.data, user: user, is_public: data.is_public }).save();

    socket.emit('created:board', { d: createdBoard });
  }

  @OnMessage('get-all:board')
  async getAllBoards(@ConnectedSocket() socket: SocketWithUser) {
    const { user } = socket;
    const userBoards = await this.boardRepo.find({ user: user });
    socket.emit('send-all:boards', { d: userBoards });
  }
}
