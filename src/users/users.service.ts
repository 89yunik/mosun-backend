import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      email: 'changeme@test.com',
      name: 'john',
    },
    {
      email: 'guess@test.com',
      name: 'maria',
    },
  ];
  async createUser(user: User): Promise<User> {
    this.users.push(user);
    return this.users[this.users.length - 1];
  }
  async readUserByEmail(target: User): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === target.email);
    if (user) {
      return user;
    } else {
      throw new Error('입력한 값에 해당하는 사용자를 찾을 수 없습니다.');
    }
  }
}
