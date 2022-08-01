import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async readOrCreateUser(target: UserType): Promise<UserType> {
    let user = await this.usersService.readUserByEmail(target);
    if (!user) {
      console.log('회원가입');
      user = await this.usersService.createUser(target);
    }
    return user;
  }
  setToken(targetType: string, target?: UserType): string {
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
