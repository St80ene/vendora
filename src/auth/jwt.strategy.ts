import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './constants';

export type AuthUser = {
  id: string;
  email: string;
  password: string;
  iat: number;
  exp: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: AuthUser): Promise<any> {
    const now = Date.now();

    if (payload?.exp * 1000 < now) {
      // Token has expired
      throw new UnauthorizedException('Session has expired');
    }

    const user = await this.authService.validateUserJwt(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
