import { Router } from 'express';
import { Board } from 'src/entities/board';
import { authMiddleware } from 'src/middlewares/authMiddleware';
import { RequestWithUser } from 'src/utils/types';

const boardRouter = Router();

boardRouter.use(authMiddleware);

boardRouter.post('/', async (req: RequestWithUser, res) => {
  const { userId, body } = req;
  const createdBoard = await Board.create({ user: { id: userId }, data: body.data, is_public: body.is_public }).save();
  res.send(createdBoard);
});
export { boardRouter };
