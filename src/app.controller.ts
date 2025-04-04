import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Roles } from './users/roles.decorator';
import { RolesGuard } from './auth/role-guard';
import { UserRole } from './users/enums/user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  /** GET Methods */
  /**
   * @openapi
   * '/api/user/{username}':
   *  get:
   *     tags:
   *     - User Controller
   *     summary: Get a user by username
   *     parameters:
   *      - name: username
   *        in: path
   *        description: The username of the user
   *        required: true
   *     responses:
   *      200:
   *        description: Fetched Successfully
   *      400:
   *        description: Bad Request
   *      404:
   *        description: Not Found
   *      500:
   *        description: Server Error
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard(['jwt']), RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @Get('mirole')
  miRole(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
      ip: string;
      source_url: string;
    }
  ) {
    return this.authService.login(body);
  }
}
