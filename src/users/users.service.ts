import { Injectable } from '@nestjs/common';
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
  async createUser(target: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(target);
    await this.usersRepository.save(user);
    return user;
  }
  async readUsers(options?: Partial<User>): Promise<User[]> {
    return this.usersRepository.find();
  }

  async readUser(options: Partial<User>): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy(options);
    if (user) {
      return user;
    }
  }

  async readOrCreateUser(target: CreateUserDto): Promise<User> {
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
