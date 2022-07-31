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
  async createUser(target: User): Promise<User> {
    this.users.push(target);
    const user = this.users[this.users.length - 1];
    return user;
  }
  async readUserByEmail(target: User): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === target.email);
    return user;
  }
}
