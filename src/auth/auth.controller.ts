import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get(':domain')
  login(@Param('domain') domain: string): string {
    return this.authService.login(domain);
  }
}
