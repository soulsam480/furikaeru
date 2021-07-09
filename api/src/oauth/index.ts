import passport from 'passport';
import { setupGoogleOauth } from 'src/oauth/google';
import { setupFbOauth } from './fb';

setupGoogleOauth(passport);
setupFbOauth(passport);

export { passport as passportInstance };
