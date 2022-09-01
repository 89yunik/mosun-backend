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

  async createTeam(target: CreateTeamDto): Promise<Team> {
    const team = this.teamsRepository.create(target);
    await this.teamsRepository.save(team);
    return team;
  }

  async readTeams(keyword?: string): Promise<Team[]> {
    const readResult = await this.teamsRepository
      .createQueryBuilder()
      .select()
      .where(
        `${
          keyword
            ? `MATCH(name) AGAINST ('${keyword}*' IN BOOLEAN MODE)`
            : 'TRUE'
        }`,
      )
      .getMany();
    return readResult;
  }
  async updateTeam(
    target: Partial<Team>,
    update: Partial<Team>,
  ): Promise<void> {
    await this.teamsRepository.update(target, update);
  }

  async deleteTeam(target: Partial<Team>): Promise<void> {
    await this.teamsRepository.delete(target);
  }
}
