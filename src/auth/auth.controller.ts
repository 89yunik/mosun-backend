import {
  Controller,
  Req,
  Post,
  Get,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';
import { UserType } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin(): void {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(200)
  googleCallback(@User() user: UserType): void {
    console.log(this.authService.setToken(user));
    return;
  }

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  kakaoLogin(): void {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: UserType) {
    return user;
  }
}
