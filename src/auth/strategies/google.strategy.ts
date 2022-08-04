import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: typeof Profile,
    done: typeof VerifyCallback,
  ): Promise<any> {
    const { email, name } = profile._json;
    try {
      const user = await this.usersService.readOrCreateUser({ email, name });
      done(null, user);
    } catch (err) {
      done(err, undefined);
    }
  }
}
