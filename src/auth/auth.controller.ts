import { Controller, Request, Post, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @Post('kakao')
  @UseGuards(KakaoAuthGuard)
  kakaoLogin(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }
}
