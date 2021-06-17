import { verify } from 'jsonwebtoken';
import { Middleware, MiddlewareInterface } from 'socket-controllers';
import { User } from 'src/entities/user';
import { ERROR_MESSAGES, NAMESPACES } from 'src/utils/constants';
import { SocketWithUser } from 'src/utils/types';

@Middleware()
export class AuthenticationMiddleware implements MiddlewareInterface {
  async use(socket: SocketWithUser, next: (err?: any) => any) {
    const {
      nsp: { name },
      handshake: {
        headers: { authorization },
      },
    } = socket;
    if (name === NAMESPACES.board) {
      if (typeof authorization !== 'string') return next({ err: ERROR_MESSAGES.unauthorized });
      const token = authorization.split('Bearer ')[1];
      if (!!!token) return next({ err: ERROR_MESSAGES.bad_request });
      const data = <{ userId: string }>verify(token, process.env.ACCESS_TOKEN_SECRET as string);

      const user = await User.findOne({ id: data.userId });

      if (!user) return next({ err: ERROR_MESSAGES.user_not_found });
      socket.user = user;
      return next();
    }

    next();
  }
}
