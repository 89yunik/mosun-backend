import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async createUser(target: CreateUserDto): Promise<Partial<User>> {
    const user = this.usersRepository.create(target);
    // if (user) {
    await this.usersRepository.save(user);
    return { id: user.id, email: user.email, name: user.name };
    // } else {
    //   throw new BadRequestException(
    //     '생성하려는 계정의 필수 입력값을 확인해 주십시오.',
    //   );
    // }
  }
  async readUsers(name?: string): Promise<User[]> {
    return this.usersRepository.find();
  }

  async readUser(options: Partial<User>): Promise<Partial<User> | undefined> {
    const user = await this.usersRepository.findOneBy(options);
    if (user) {
      return { id: user.id, email: user.email, name: user.name };
    }
  }

  async readOrCreateUser(target: CreateUserDto): Promise<Partial<User>> {
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

  async deleteUser(target: Partial<User>): Promise<void> {
    await this.usersRepository.delete(target);
  }
}
