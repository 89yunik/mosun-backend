import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

const validateEmail = (email: string): boolean => {
  const emailPattern = /\w+@\w+.+\w/;
  return email.match(emailPattern) ? true : false;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  private readonly users = [
    {
      email: 'test@existentEmail.com',
      name: 'john',
    },
    {
      email: 'existentUser@test.com',
      name: 'existentUser',
    },
  ];
  async createUser(target: Partial<User>): Promise<Partial<User>> {
    if (validateEmail(target.email)) {
      const user = this.usersRepository.create(target);
      if (user) {
        await this.usersRepository.save(user);
        return { email: user.email, name: user.name };
      } else {
        const error = new Error('');
        error.name = '';
        throw error;
      }
    } else {
      const error = new Error('생성하려는 이메일 형식이 유효하지 않습니다.');
      error.name = 'Unprocessable Entity';
      throw error;
    }
  }
  async readUsers(name?: string) {
    return this.usersRepository.find();
  }
  async readUserByEmail(email: string): Promise<Partial<User> | undefined> {
    if (validateEmail(email)) {
      const user = await this.usersRepository.findOneBy({ email });
      if (user) {
        return { email: user.email, name: user.name };
      }
    } else {
      const error = new Error('찾으려는 이메일 형식이 유효하지 않습니다.');
      error.name = 'Unprocessable Entity';
      throw error;
    }
  }

  async readOrCreateUser(target: Partial<User>): Promise<Partial<User>> {
    let user = await this.readUserByEmail(target.email);
    if (!user) {
      console.log('회원가입');
      user = await this.createUser(target);
    }
    return user;
  }
}
