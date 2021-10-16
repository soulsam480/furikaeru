import { Router } from 'express';
import { sign, verify } from 'jsonwebtoken';
import passport from 'passport';
import { User } from 'src/entities/user';
import { authMiddleware } from 'src/middlewares/authMiddleware';
import { createTokens } from 'src/services/auth';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { RequestWithUser } from 'src/utils/types';

export const authRouter = Router();

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/redirect', passport.authenticate('google'), (req: RequestWithUser, res) => {
  const uid = req?.user?.id;
  const token = sign({ userId: uid }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15min',
  });

  const redirectUrl = !process.env.PROD
    ? `http://localhost:4000/#/?auth_success=${token}`
    : `https://furikaeru.sambitsahoo.com/?auth_success=${token}`;

  res.redirect(redirectUrl);
});

authRouter.get('/fb', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

authRouter.get('/fb/redirect', passport.authenticate('facebook'), (req: RequestWithUser, res) => {
  const uid = req?.user?.id;
  const token = sign({ userId: uid }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15min',
  });

  const redirectUrl = !process.env.PROD
    ? `http://localhost:4000/#/?auth_success=${token}`
    : `https://furikaeru.sambitsahoo.com/?auth_success=${token}`;

  res.redirect(redirectUrl);
});

authRouter.get('/token', async (request, response) => {
  const refreshToken = request.headers['refresh-token'] as string;
  const token = refreshToken.split('Bearer ')[1];

  if (typeof refreshToken !== 'string' || !token)
    return response.status(400).send(ERROR_MESSAGES.refresh_token_not_found);

  try {
    const data = <{ userId: string }>verify(token, process.env.REFRESH_TOKEN_SECRET as string);

    const user = await User.findOne({ id: data.userId });

    if (!user) return response.status(404).send(ERROR_MESSAGES.user_not_found);

    response.send(createTokens(user));
  } catch {
    response.status(400).send(ERROR_MESSAGES.acccess_token_expired);
  }
});

authRouter.get('/user', authMiddleware, async (req: RequestWithUser, res) => {
  try {
    const user = await User.findOne({ id: req.userId });

    if (!user) return res.status(404).send(ERROR_MESSAGES.user_not_found);

    res.send({ ...user, ...createTokens(user) });
  } catch {
    res.status(400).send(ERROR_MESSAGES.acccess_token_expired);
  }
});
