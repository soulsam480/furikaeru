require('tsconfig-paths/register');
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '../.env') });
const PORT = process.env.PORT || 3000;
import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { createConnection, getRepository } from 'typeorm';
import 'reflect-metadata';
import { useSocketServer } from 'socket-controllers';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth2';
import { User } from 'src/entities/user';
import { authRouter } from 'src/auth';
import cors from 'cors';
import { CORS_ORIGINS } from 'src/utils/constants';

passport.use(
  new Strategy(
    {
      clientID: process.env.GCLIENT_ID as string,
      clientSecret: process.env.GCLIENT_SECRET as string,
      callbackURL: !process.env.PROD
        ? 'http://localhost:3000/furikaeru/auth/google/redirect'
        : 'https://apis.sambitsahoo.com/furikaeru/auth/google/redirect',
      passReqToCallback: true,
    },
    async (request: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
      const userRepo = getRepository(User);
      const user = await userRepo.findOne({
        where: [{ ga_id: profile.id }, { email: profile.email }],
      });
      if (!user) {
        userRepo
          .create({
            name: profile.displayName,
            email: profile.email,
            ga_id: profile.id,
            username: profile.email.split('@')[0],
          })
          .save()
          .then((user) => done(null, user));
        return;
      }
      if (!user.ga_id) await userRepo.update({ email: user.email }, { ga_id: profile.id });
      done(null, user);
    },
  ),
);

passport.serializeUser((user, cb) => {
  cb(null, (user as any).id);
});

passport.deserializeUser(async (id: string, cb) => {
  const user = await getRepository(User).findOne({ where: { id: id } });
  if (!user) return;
  cb(null, user);
});

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
  app.use(passport.initialize());
  app.use('/furikaeru/auth', authRouter);

  const server = createServer(app);
  const io = new SocketServer(server, {
    path: '/furikaeru/ws/',
    allowUpgrades: true,
    cors: {
      preflightContinue: true,
      credentials: true,
      origin: [...CORS_ORIGINS],
    },
  });

  await createConnection({
    // database: join(__dirname, '../db.sqlite'),
    // type: 'better-sqlite3',
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
      //todo these are sqlite specific // await conn.query('PRAGMA foreign_keys=OFF;');
      await conn.runMigrations();
      //todo these are sqlite specific // await conn.query('PRAGMA foreign_keys=ON;');

      useSocketServer(io, {
        controllers: [__dirname + '/controllers/*{.ts,.js}'],
        middlewares: [__dirname + '/middlewares/*{.ts,.js}'],
      });

      server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.log(err);
    });
}

main();
