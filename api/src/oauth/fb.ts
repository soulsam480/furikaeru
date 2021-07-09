import { PassportStatic } from 'passport';
import { Strategy } from 'passport-facebook';
import { User } from 'src/entities/user';
import { getRepository } from 'typeorm';

export function setupFbOauth(passportInstance: PassportStatic) {
  passportInstance.use(
    new Strategy(
      {
        clientID: process.env.FAPP_ID as string,
        clientSecret: process.env.FAPP_SECRET as string,
        callbackURL: !process.env.PRODx
          ? 'https://localhost:2015/furikaeru/auth/fb/redirect'
          : (process.env.FAUTH_REDIRECT as string),
        profileFields: ['email', 'displayName', 'id'],
      },
      async (_: any, __: any, profile: any, done: any) => {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;

        const userRepo = getRepository(User);
        const user = await userRepo.findOne({
          where: [{ email }, { fb_id: id }],
        });

        if (!user) {
          userRepo
            .create({
              name: displayName,
              email: email,
              fb_id: id,
              username: email,
            })
            .save()
            .then((user) => done(null, user));
          return;
        }
        if (!user.fb_id) await userRepo.update({ email: user.email }, { fb_id: id });
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
