import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateMemberDto } from './dtos/create-member.dto';
import { Member } from './member.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}
  async createMember(memberInfo: CreateMemberDto): Promise<void> {
    const member = this.membersRepository.create(memberInfo);
    await this.membersRepository.save(member);
  }

  async readMembers(
    options: Partial<Member>,
    keyword?: string,
  ): Promise<Member[]> {
    let readResult;
    if (keyword) {
      readResult = await this.membersRepository
        .createQueryBuilder('member')
        .select(['user.name', 'member.authority'])
        .innerJoin('member.user', 'user')
        .where(`MATCH(user.name) AGAINST ('${keyword}*' IN BOOLEAN MODE)`)
        .getMany();
    } else {
      readResult = this.membersRepository.findBy(options);
    }
    return readResult;
  }

  readMember(options: Partial<Member>): Promise<Member> {
    return this.membersRepository.findOneBy(options);
  }
  async updateMember(
    target: Partial<Member>,
    update: Partial<Member>,
  ): Promise<UpdateResult> {
    const updateResult = await this.membersRepository.update(target, update);
    return updateResult;
  }

  async deleteMember(target: Partial<Member>): Promise<DeleteResult> {
    const deleteResult = await this.membersRepository.delete(target);
    return deleteResult;
  }
}
