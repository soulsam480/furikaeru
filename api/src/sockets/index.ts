import { Server, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { SocketWithUser } from 'src/utils/types';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { User } from 'src/entities/user';
import { createListeners } from 'src/listeners';

export function createHomeSocket(io: Server) {
  createListeners(io);

  io.use(async (sock: SocketWithUser, next) => {
    const {
      handshake: {
        auth: { Authorization },
      },
    } = sock;
    if (!Authorization) {
      return next();
    }
    const token = Authorization.split('Bearer ')[1];

    if (!token) return next({ name: ERROR_MESSAGES.unauthorized, message: ERROR_MESSAGES.unauthorized });
    try {
      const data = <{ userId: string }>verify(token, process.env.ACCESS_TOKEN_SECRET as string);
      const user = await User.findOne({ id: data.userId });

      if (!user) return next({ name: ERROR_MESSAGES.user_not_found, message: ERROR_MESSAGES.user_not_found });
      sock.user = user;
      return next();
    } catch (error) {
      console.log(error);

      return next({ name: ERROR_MESSAGES.unauthorized, message: ERROR_MESSAGES.unauthorized });
    }
  });
}
