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

  async findOrCreateUser(
    email: string,
    name: string,
  ): Promise<User | undefined> {
    const user = this.users.find((user) => user.name === name);
    if (user) {
      return user;
    } else {
      this.users.push({ email, name });
      return this.users[this.users.length - 1];
    }
  }
}
