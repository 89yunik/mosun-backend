import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateScoreDto } from './dtos/create-score.dto';
import { ReadScoreDto } from './dtos/read-score.dto';
import { UpdateScoreDto } from './dtos/update-score.dto';
import { Score } from './score.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private scoresRepository: Repository<Score>,
  ) {}

  async createScore(target: CreateScoreDto): Promise<Score> {
    const score = this.scoresRepository.create(target);
    await this.scoresRepository.save(score);
    return score;
  }

  async readScores(options?: ReadScoreDto) {
    const readResult = await this.scoresRepository
      .createQueryBuilder('score')
      .select('score.memberId', 'memberId')
      .addSelect('SUM(score.point)', 'sum')
      .innerJoin('score.record', 'record')
      .innerJoin('record.schedule', 'schedule')
      .andWhere(
        `${
          options.period
            ? `DATE(schedule.date) BETWEEN '${options.period.start}' AND '${options.period.end}'`
            : 'TRUE'
        }`,
      )
      .andWhere(`${options.type ? `record.type = '${options.type}'` : 'TRUE'}`)
      .andWhere(
        `${options.memberId ? `score.memberId = ${options.memberId}` : 'TRUE'}`,
      )
      .groupBy('score.memberId')
      .getRawMany();
    return readResult;
  }
  async updateScore(
    target: Partial<Score>,
    update: UpdateScoreDto,
  ): Promise<UpdateResult> {
    const updateResult = await this.scoresRepository.update(target, update);
    return updateResult;
  }

  async deleteScore(target: Partial<Score>): Promise<DeleteResult> {
    const deleteResult = await this.scoresRepository.delete(target);
    return deleteResult;
  }
}
