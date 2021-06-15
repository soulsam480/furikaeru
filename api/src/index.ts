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
import { useSocketServer } from 'socket-controllers';

async function main() {
  const app = express();
  const server = createServer(app);
  const io = new SocketServer(server, {
    cors: {
      origin: ['http://localhost:4000'],
    },
    path: '/ws',
  });
  await createConnection({
    database: join(__dirname, '../db.sqlite'),
    type: 'better-sqlite3',
    entities: [join(__dirname, './entities/*')],
    migrations: [join(__dirname, './migrations/*')],
    logger: /*process.env.PROD ? undefined : */ 'advanced-console',
    logging: /*process.env.PROD ? false :*/ true,
    synchronize: false,
  }).then(async (conn) => {
    await conn.query('PRAGMA foreign_keys=OFF;');
    await conn.runMigrations();
    await conn.query('PRAGMA foreign_keys=ON;');
    useSocketServer(io, {
      controllers: [__dirname + '/controllers/**/*{.ts,.js}'],
      //   middlewares: [__dirname + '/middlewares/**/*.js'],
    });
    server.listen(PORT, () =>
      console.log(`Listening on http://localhost:${PORT}`),
    );
  });
}
main();
