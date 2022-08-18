import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/members/member.entity';
import { MembersService } from 'src/members/members.service';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dtos/create-team.dto';
import { Team } from './team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    private membersService: MembersService,
  ) {}
  async createTeamOfUser(
    target: CreateTeamDto,
    userId: number,
  ): Promise<Partial<Team>> {
    const team = this.teamsRepository.create(target);
    await this.teamsRepository.save(team);
    this.membersService.createMember({
      teamId: team.id,
      userId,
      authority: 'admin',
    });
    return { name: team.name };
  }
  async readTeamsOfUser(userId: number): Promise<Member[]> {
    const teams = await this.membersService.readMembers({ userId });
    return teams;
  }
  //   async updateTeamOfUser(userId: number): Promise<void> {}
  //   async deleteTeamOfUser(userId: number): Promise<void> {}
}
