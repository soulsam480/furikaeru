import { Router } from 'express';
import { authenticate } from 'passport';

export const authRouter = Router();

authRouter.get(
  '/google',
  authenticate('google', { scope: ['profile', 'email'] }),
);
authRouter.get('/google/redirect', authenticate('google'), (req, res) => {
  res.redirect('/');
});
