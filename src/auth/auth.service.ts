import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async readOrCreateUser(target: User): Promise<User> {
    let user = await this.usersService.readUserByEmail(target);
    if (!user) {
      console.log('회원가입');
      user = await this.usersService.createUser(target);
    }
    return user;
  }
  async setToken(user: any) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
