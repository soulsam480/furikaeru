import { Router } from 'express';
import { Board } from 'src/entities/board';
import { authMiddleware } from 'src/middlewares/authMiddleware';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { RequestWithUser } from 'src/utils/types';

const boardRouter = Router();
boardRouter.use(authMiddleware);

boardRouter.post('/', async (req: RequestWithUser, res) => {
  const { userId, body } = req;
  try {
    const createdBoard = await Board.create({
      user: { id: userId },
      data: body.data,
      is_public: body.is_public,
      title: body.title,
    }).save();

    res.send(createdBoard);
  } catch (error) {
    console.log(error);

    res.status(500).send(ERROR_MESSAGES.iss);
  }
});

boardRouter.get('/', async (req: RequestWithUser, res) => {
  const { userId } = req;
  try {
    const userBoards = await Board.find({
      where: { user: { id: userId }, is_deleted: false },
      order: { updated_at: 'DESC' },
    });

    res.send([...userBoards.map((el) => ({ ...el, data: undefined }))]);
  } catch (error) {
    console.log(error);

    res.status(500).send(ERROR_MESSAGES.iss);
  }
});

boardRouter.get('/archive', async (req: RequestWithUser, res) => {
  const { userId } = req;
  try {
    const userBoards = await Board.find({
      where: { user: { id: userId }, is_deleted: true },
      order: { updated_at: 'DESC' },
    });

    res.send([...userBoards.map((el) => ({ ...el, data: undefined }))]);
  } catch (error) {
    console.log(error);

    res.status(500).send(ERROR_MESSAGES.iss);
  }
});

boardRouter.get('/:id', async (req: RequestWithUser, res) => {
  const {
    userId,
    params: { id },
  } = req;
  try {
    const userBoard = await Board.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
      loadRelationIds: true,
    });
    if (!userBoard) return res.status(404).send(ERROR_MESSAGES.not_found);

    res.send(userBoard);
  } catch (error) {
    console.log(error);

    res.status(500).send(ERROR_MESSAGES.iss);
  }
});

boardRouter.patch('/:id', async (req: RequestWithUser, res) => {
  const {
    userId,
    params: { id },
  } = req;
  try {
    const body = req.body as Partial<Board>;

    await Board.update({ id, user: { id: userId } }, { ...body });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);

    res.status(500).send(ERROR_MESSAGES.iss);
  }
});

boardRouter.delete('/:id', async (req: RequestWithUser, res) => {
  const {
    userId,
    params: { id },
  } = req;
  try {
    await Board.delete({ id, user: { id: userId } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);

    res.status(500).send(ERROR_MESSAGES.iss);
  }
});

export { boardRouter };
