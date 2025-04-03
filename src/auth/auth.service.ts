import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.userService.findOne(email);

      if (user) {
        const match = await argon2.verify(pass, user[0].password);

        if (match) {
          const { ...result } = user;
          return result;
        }
      }
      return null;
    } catch (error) {
      return error;
    }
  }

  async validateUserJwt(authUser: AuthUser): Promise<any> {
    const user = await this.userService.findById(authUser.id);

    if (user) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(data: any): Promise<any> {
    try {
      const payload = {
        email: data.email.toLowerCase(),
        password: data.password,
      };

      const user = await User.findOne({
        where: { email: payload.email },
        select: ['id', 'email', 'password'],
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      // verify user's password
      const match = await argon2.verify(user?.password, data?.password);

      if (match) {
        let token: string = this.jwtService.sign(
          { id: user.id, ...payload },
          { secret: '' }
        );

        return { token, user };
      } else {
      }
    } catch (error) {
      throw error;
    }
  }
}
