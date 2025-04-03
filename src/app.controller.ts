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
