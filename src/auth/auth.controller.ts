import { Controller, Get, UseGuards, HttpCode, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { UserReq } from './decorators/user.decorator';
import { Response } from 'express';
import { User } from 'src/users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin(): void {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(200)
  googleCallback(
    @UserReq() user: Partial<User>,
    @Res() res: Response,
  ): Response {
    const accessExp = Number(process.env.JWT_ACCESS_EXP);
    const refreshExp = Number(process.env.JWT_REFRESH_EXP);
    const accessToken = this.authService.setToken('access', user);
    const refreshToken = this.authService.setToken('refresh');
    res.cookie('accessToken', accessToken, {
      maxAge: accessExp * 60 * 1000,
      httpOnly: true,
    });
    res
      .cookie('refreshToken', refreshToken, {
        maxAge: refreshExp * 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect(process.env.AUTH_REDIRECT);

    return res;
  }

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  kakaoLogin(): void {}

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  @HttpCode(200)
  kakaoCallback(
    @UserReq() user: Partial<User>,
    @Res() res: Response,
  ): Response {
    const accessExp = Number(process.env.JWT_ACCESS_EXP);
    const refreshExp = Number(process.env.JWT_REFRESH_EXP);
    const accessToken = this.authService.setToken('access', user);
    const refreshToken = this.authService.setToken('refresh');
    res.cookie('accessToken', accessToken, {
      maxAge: accessExp * 60 * 1000,
      httpOnly: true,
    });
    res
      .cookie('refreshToken', refreshToken, {
        maxAge: refreshExp * 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect(process.env.AUTH_REDIRECT);
    return res;
  }
}
