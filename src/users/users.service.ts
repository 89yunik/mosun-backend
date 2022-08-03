import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type UserType = {
  email: string;
  name: string;
};

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
  async createUser(target: UserType): Promise<UserType> {
    //email 형식이 아니면 저장하지 않는 로직 필요
    this.users.push(target);
    const user = this.users[this.users.length - 1];
    return user;
  }
  async readUserByEmail(
    target: Partial<UserType>,
  ): Promise<UserType | undefined> {
    const user = this.users.find((user) => user.email === target.email);
    return user;
  }
}
