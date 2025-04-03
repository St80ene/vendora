import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, pass: string) {
    const user = await this.authService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
