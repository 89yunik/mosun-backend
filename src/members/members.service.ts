import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}
  async createMember(memberInfo: Partial<Member>) {
    const { team, user, authority } = memberInfo;
    const member = this.membersRepository.create({
      team,
      user,
      authority,
    });
    await this.membersRepository.save(member);
  }
}
