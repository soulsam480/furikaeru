import { PassportStatic } from 'passport';
import { Strategy } from 'passport-google-oauth2';
import { User } from 'src/entities/user';
import { getRepository } from 'typeorm';

export function setupGoogleOauth(passportInstance: PassportStatic) {
  passportInstance.use(
    new Strategy(
      {
        clientID: process.env.GCLIENT_ID as string,
        clientSecret: process.env.GCLIENT_SECRET as string,
        callbackURL: !process.env.PROD
          ? 'http://localhost:3000/furikaeru/auth/google/redirect'
          : (process.env.GAUTH_REDIRECT as string),
        passReqToCallback: true,
      },
      async (request: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
        const userRepo = getRepository(User);
        const user = await userRepo.findOne({
          where: [{ email: profile.email }, { ga_id: profile.id }],
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

  passportInstance.serializeUser((user, cb) => {
    cb(null, (user as any).id);
  });

  passportInstance.deserializeUser(async (id: string, cb) => {
    const user = await getRepository(User).findOne({ where: { id: id } });
    if (!user) return;
    cb(null, user);
  });
}
