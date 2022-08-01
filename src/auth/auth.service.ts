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
  async setToken(target: UserType) {
    const token = this.jwtService.sign(target, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.ACCESS_EXP,
    });
    return token;
  }
}
