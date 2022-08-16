import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dtos/create-team.dto';
import { Team } from './team.entity';
// import { GroupUser } from './group_user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>, // @InjectRepository(GroupUser) // private groupUsersRepository: Repository<GroupUser>,
  ) {}
  async createTeamOfUser(
    target: CreateTeamDto,
    userId: number,
  ): Promise<Partial<Team>> {
    const team = this.teamsRepository.create(target);
    await this.teamsRepository.save(team);
    // const groupUser = this.groupUsersRepository.create({
    //   group_id: group.id,
    //   user_id: userId,
    //   authority: 'admin',
    // });
    // await this.groupUsersRepository.save(groupUser);
    return { name: team.name };
  }
  //   async readGroupsOfUser(userId: number): Promise<void> {}
  //   async updateGroupOfUser(userId: number): Promise<void> {}
  //   async deleteGroupOfUser(userId: number): Promise<void> {}
}
