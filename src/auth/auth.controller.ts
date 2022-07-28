import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  googleLogin(): string {
    return this.authService.googleLogin();
  }

  @Get('naver')
  naverLogin(): string {
    return this.authService.naverLogin();
  }
}
