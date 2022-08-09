import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
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
  async createUser(target: Partial<User>): Promise<Partial<User>> {
    if (validateEmail(target.email)) {
      const user = this.usersRepository.create(target);
      if (user) {
        await this.usersRepository.save(user);
        return { email: user.email, name: user.name };
      } else {
        throw new BadRequestException(
          '생성하려는 계정의 필수 입력값을 확인해 주십시오.',
        );
      }
    } else {
      throw new UnprocessableEntityException(
        '생성하려는 이메일 형식이 유효하지 않습니다.',
      );
    }
  }
  async readUsers(name?: string) {
    return this.usersRepository.find();
  }

  async readUser(options: Partial<User>): Promise<Partial<User> | undefined> {
    if (options.email) {
      if (validateEmail(options.email)) {
        const user = await this.usersRepository.findOneBy(options);
        if (user) {
          return { email: user.email, name: user.name };
        }
      } else {
        throw new UnprocessableEntityException(
          '찾으려는 이메일 형식이 유효하지 않습니다.',
        );
      }
    } else {
      const user = await this.usersRepository.findOneBy(options);
      if (user) {
        return { email: user.email, name: user.name };
      }
    }
  }
  // async readUserByEmail(email: string): Promise<Partial<User> | undefined> {
  //   if (validateEmail(email)) {
  //     const user = await this.usersRepository.findOneBy({ email });
  //     if (user) {
  //       return { email: user.email, name: user.name };
  //     }
  //   } else {
  //     throw new UnprocessableEntityException(
  //       '찾으려는 이메일 형식이 유효하지 않습니다.',
  //     );
  //   }
  // }

  async readOrCreateUser(target: Partial<User>): Promise<Partial<User>> {
    let user = await this.readUser(target);
    if (!user) {
      console.log('회원가입');
      user = await this.createUser(target);
    }
    return user;
  }
  async updateUser(
    target: Partial<User>,
    update: Partial<User>,
  ): Promise<void> {
    await this.usersRepository.update(target, update);
  }
}
