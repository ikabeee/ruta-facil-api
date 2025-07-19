import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { OAuthStrategyInterface, OAuthUserData } from '../interfaces/OAuthStrategy.interface';

export class GoogleOAuthStrategy implements OAuthStrategyInterface {
    constructor() {
        this.configureStrategy();
    }

    private configureStrategy(): void {
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:7000/api/v1/auth/google/callback',
            scope: ['email', 'profile'],
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const userData = await this.validateUser(profile);
                // Retornamos los datos del usuario como un objeto simple que se agregará a req.user
                return done(null, userData as any);
            } catch (error) {
                return done(error, false);
            }
        }));
    }

    async validateUser(profile: Profile): Promise<OAuthUserData> {
        const { id, name, emails, photos } = profile;
        
        if (!emails || !emails.length) {
            throw new Error('No email found in Google profile');
        }

        return {
            email: emails[0].value,
            firstName: name?.givenName || '',
            lastName: name?.familyName || '',
            picture: photos?.[0]?.value,
            provider: 'google',
            providerId: id,
        };
    }
}
