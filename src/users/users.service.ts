import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
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
  async readUsers(keyword: string): Promise<User[]> {
    const readResult = await this.usersRepository
      .createQueryBuilder()
      .select()
      .where(`MATCH(name) AGAINST ('${keyword}*' IN BOOLEAN MODE)`)
      .getMany();
    return readResult;
  }

  async readUser(options: Partial<User>): Promise<Partial<User>> {
    const user = await this.usersRepository.findOneBy(options);
    if (user) {
      const { id, email, name } = user;
      return { id, email, name };
    }
  }

  async readOrCreateUser(target: CreateUserDto): Promise<Partial<User>> {
    let user = await this.readUser({ email: target.email });
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
