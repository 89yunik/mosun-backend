import { Controller, Get, UseGuards, HttpCode, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request, Response } from 'express';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

declare global {
  namespace Express {
    interface Request {
      user: Partial<User>;
    }
  }
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin(): void {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(200)
  googleCallback(@Req() req: Request, @Res() res: Response): Response {
    const user = req.user;
    const refreshExp = Number(process.env.JWT_REFRESH_EXP);
    const accessToken = this.authService.setToken('access', user);
    const refreshToken = this.authService.setToken('refresh');
    this.usersService.updateUser(user, { refreshToken });
    res.cookie('refreshToken', refreshToken, {
      maxAge: refreshExp * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.json({ accessToken }).redirect(process.env.AUTH_REDIRECT);
    return res;
  }

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  kakaoLogin(): void {}

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  @HttpCode(200)
  kakaoCallback(@Req() req: Request, @Res() res: Response): Response {
    const user = req.user;
    const refreshExp = Number(process.env.JWT_REFRESH_EXP);
    const accessToken = this.authService.setToken('access', user);
    const refreshToken = this.authService.setToken('refresh');
    this.usersService.updateUser(user, { refreshToken });
    res.cookie('refreshToken', refreshToken, {
      maxAge: refreshExp * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.json({ accessToken }).redirect(process.env.AUTH_REDIRECT);
    return res;
  }

  @Get('accessToken')
  @UseGuards(JwtAuthGuard)
  async getAccessToken(@Req() req) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const user = await this.usersService.readUser({ refreshToken });
      const accessToken = this.authService.setToken('access', user);
      return { accessToken };
    }
  }
}
