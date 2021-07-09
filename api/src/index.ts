require('tsconfig-paths/register');
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '../.env') });
const PORT = process.env.PORT || 3000;
import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import { authRouter } from 'src/express';
import cors from 'cors';
import { CORS_ORIGINS } from 'src/utils/constants';
import { createHomeSocket } from 'src/sockets';
import { boardRouter } from 'src/express/board';
import { passportInstance } from 'src/oauth';

async function main() {
  const app = express();

  app.use(
    cors({
      origin: [...CORS_ORIGINS],
      credentials: true,
      preflightContinue: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(passportInstance.initialize());
  app.use('/furikaeru/auth', authRouter);
  app.use('/furikaeru/board', boardRouter);

  const server = createServer(app);
  const io = new SocketServer(server, {
    path: '/furikaeru/ws/',
    allowUpgrades: true,
    cors: {
      credentials: true,
      origin: [...CORS_ORIGINS],
    },
  });

  await createConnection({
    type: 'postgres',
    database: process.env.PGRES_DB,
    username: process.env.PGRES_USER,
    password: process.env.PGRES_PASS,
    host: process.env.PGRES_HOST,
    port: 5432,
    entities: [join(__dirname, './entities/*')],
    migrations: [join(__dirname, './migrations/*')],
    logger: /*process.env.PROD ? undefined : */ 'advanced-console',
    logging: /*process.env.PROD ? false :*/ true,
    synchronize: false,
  })
    .then(async (conn) => {
      await conn.runMigrations();

      createHomeSocket(io);
      server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.log(err);
    });
}

main();
