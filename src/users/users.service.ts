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
    return this.usersRepository.findBy(options);
  }

  async readUser(options: Partial<User>): Promise<Partial<User>> {
    const { id, email, name } = await this.usersRepository.findOneBy(options);
    return { id, email, name };
  }

  async readOrCreateUser(target: CreateUserDto): Promise<Partial<User>> {
    let user = await this.readUser(target);
    if (!user) {
      console.log('회원가입');
      user = await this.createUser(target);
    }
    return { id: user.id, email: user.email, name: user.name };
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
