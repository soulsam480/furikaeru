import { sign } from 'jsonwebtoken';
import { User } from 'src/entities/user';

export function createTokens(user: Partial<User>): {
  refreshToken: string;
  accessToken: string;
} {
  const refreshToken = sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: '14d',
    },
  );
  const accessToken = sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: '15min',
    },
  );

  return { refreshToken, accessToken };
}
