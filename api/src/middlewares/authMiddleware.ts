import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { RequestWithUser } from 'src/utils/types';

export function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  console.log(req.headers);
  const accessToken = req.headers['access-token'] as string;

  if (typeof accessToken !== 'string') return res.sendStatus(401);
  const token = accessToken.split('Bearer ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const data = <{ userId: string }>verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    req.userId = data.userId;
    return next();
  } catch {
    return res.sendStatus(401);
  }
}
