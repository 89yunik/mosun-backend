import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dtos/create-member.dto';
import { Member } from './member.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}
  async createMember(newMemberInfo: CreateMemberDto): Promise<void> {
    const member = this.membersRepository.create(newMemberInfo);
    await this.membersRepository.save(member);
  }

  readMembers(options: Partial<Member>): Promise<Member[]> {
    return this.membersRepository.findBy(options);
  }
}
