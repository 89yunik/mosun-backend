import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async readOrCreateUser(target: User): Promise<User> {
    let user = await this.usersService.readUserByEmail(target);
    if (!user) {
      user = await this.usersService.createUser(target);
    }
    return user;
  }
  login(domain: string): string {
    return `${domain} login`;
  }
}
