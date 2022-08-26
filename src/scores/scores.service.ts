import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateScoreDto } from './dtos/create-score.dto';
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

  async readScores(options?: Partial<Score>): Promise<Score[]> {
    return this.scoresRepository.findBy(options);
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
