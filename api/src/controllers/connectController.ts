import { OnConnect, SocketController, ConnectedSocket, OnDisconnect, MessageBody, OnMessage } from 'socket-controllers';
import { Socket } from 'socket.io';

@SocketController()
export class connectedController {
  @OnConnect()
  connection(@ConnectedSocket() socket: Socket) {
    socket.on('error', (err) => console.log(err));
    console.log('client connected');
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: Socket) {
    console.log('client disconnected');
  }

  @OnMessage('ping')
  save(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    socket.emit('pong');
  }
}
