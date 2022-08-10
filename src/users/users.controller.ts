import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { User } from './user.entity';
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
  async getProfile(@Req() req) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const user = await this.usersService.readUser({ refreshToken });
      return user;
    }
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response): Response {
    res.clearCookie('refreshToken').redirect(process.env.AUTH_REDIRECT);
    return res;
  }
}
