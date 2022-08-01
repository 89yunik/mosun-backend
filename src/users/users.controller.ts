import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService, UserType } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@User() user: UserType) {
    return user;
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken').redirect(process.env.AUTH_REDIRECT);
  }
}
