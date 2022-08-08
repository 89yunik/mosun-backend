import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserReq } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('search')
  @UseGuards(JwtAuthGuard)
  searchUser() {
    return this.usersService.readUsers();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@UserReq() user: Partial<User>) {
    return user;
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response): Response {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken').redirect(process.env.AUTH_REDIRECT);
    return res;
  }
}
