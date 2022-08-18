import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dtos/create-team.dto';
import { Team } from './team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}
  async createTeamOfUser(
    target: CreateTeamDto,
    userId: number,
  ): Promise<Partial<Team>> {
    const team = this.teamsRepository.create(target);
    await this.teamsRepository.save(team);
    // const teamUser = this.teamUsersRepository.create({
    //   team_id: team.id,
    //   user_id: userId,
    //   authority: 'admin',
    // });
    // await this.teamUsersRepository.save(teamUser);
    return { name: team.name };
  }
  //   async readTeamsOfUser(userId: number): Promise<void> {}
  //   async updateTeamOfUser(userId: number): Promise<void> {}
  //   async deleteTeamOfUser(userId: number): Promise<void> {}
}
