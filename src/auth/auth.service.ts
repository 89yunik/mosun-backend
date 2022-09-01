import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginedUser } from './auth.controller';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  setToken(targetType: string, target?: Partial<LoginedUser>): string {
    switch (targetType) {
      case 'access':
        const accessToken = this.jwtService.sign(target, {
          secret: process.env.JWT_SECRET,
          expiresIn: `${process.env.JWT_ACCESS_EXP}m`,
        });
        return accessToken;
      case 'refresh':
        const refreshToken = this.jwtService.sign(
          {},
          {
            secret: process.env.JWT_SECRET,
            expiresIn: `${process.env.JWT_REFRESH_EXP}h`,
          },
        );
        return refreshToken;
      default:
        const token = this.jwtService.sign(target, {
          secret: process.env.JWT_SECRET,
          expiresIn: `${process.env.JWT_BASIC_EXP}m`,
        });
        return token;
    }
  }
}
