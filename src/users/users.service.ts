import { Injectable } from '@nestjs/common';

export type UserType = {
  email: string; //Email type?
  name: string;
};

const validateEmail = (email: string): boolean => {
  const emailPattern = /\w+@\w+.+\w/;
  return email.match(emailPattern) ? true : false;
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
    if (validateEmail(target.email)) {
      this.users.push(target);
      const user = this.users[this.users.length - 1];
      return user;
    } else {
      const error = new Error('생성하려는 이메일 형식이 유효하지 않습니다.');
      error.name = 'Unprocessable Entity';
      throw error;
    }
  }
  async readUserByEmail(email: string): Promise<UserType | undefined> {
    if (validateEmail(email)) {
      const user = this.users.find((user) => user.email === email);
      return user;
    } else {
      const error = new Error('찾으려는 이메일 형식이 유효하지 않습니다.');
      error.name = 'Unprocessable Entity';
      throw error;
    }
  }
}
