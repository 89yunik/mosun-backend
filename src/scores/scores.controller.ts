import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateScoreDto } from './dtos/create-score.dto';
import { ReadScoreDto } from './dtos/read-score.dto';
import { ScoreRank } from './dtos/score-rank';
import { UpdateScoreDto } from './dtos/update-score.dto';
import { Score } from './score.entity';
import { ScoresService } from './scores.service';

@ApiTags('Scores')
@Controller('scores')
export class ScoresController {
  constructor(private scoresService: ScoresService) {}

  @ApiOperation({
    summary: '점수 추가 API',
    description: '점수를 추가한다.',
  })
  @ApiBody({ type: CreateScoreDto })
  @ApiResponse({ status: 201 })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createScore(@Req() req: Request): Promise<void> {
    const scoreInfo: CreateScoreDto = req.body;
    await this.scoresService.createScore(scoreInfo);
  }

  @ApiOperation({
    summary: '점수 조회 API',
    description: '조건(기간, 종류, 멤버 id)을 입력 받아 점수들을 조회한다.',
  })
  @ApiQuery({ type: ReadScoreDto })
  @ApiResponse({ status: 200 })
  @Get()
  @UseGuards(JwtAuthGuard)
  async readScores(@Req() req: Request): Promise<ScoreRank[]> {
    const start = typeof req.query.start === 'string' && req.query.start;
    const end = typeof req.query.end === 'string' && req.query.end;
    const period = req.query.start && req.query.end && { start, end };
    const type = typeof req.query.type === 'string' && req.query.type;
    const memberId =
      typeof req.query.memberId === 'string' && Number(req.query.memberId);
    const result = await this.scoresService.readScores({
      period,
      type,
      memberId,
    });
    return result;
  }

  @ApiOperation({
    summary: '점수 수정 API',
    description: '점수을 수정한다.',
  })
  @ApiParam({ name: 'scoreId' })
  @ApiBody({ type: UpdateScoreDto })
  @ApiResponse({ status: 200 })
  @Put(':scoreId')
  @UseGuards(JwtAuthGuard)
  async updateScore(@Req() req: Request): Promise<void> {
    const scoreId = Number(req.params.scoreId);
    const scoreInfo: UpdateScoreDto = req.body;
    const updateResult = await this.scoresService.updateScore(
      { id: scoreId },
      scoreInfo,
    );
    if (!updateResult.affected) {
      throw new HttpException(
        '수정하려는 점수의 scoreId를 확인하십시오.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({
    summary: '점수 삭제 API',
    description: '점수을 삭제한다.',
  })
  @ApiParam({ name: 'scoreId' })
  @ApiResponse({ status: 200 })
  @Delete(':scoreId')
  @UseGuards(JwtAuthGuard)
  async deleteScore(@Req() req: Request): Promise<void> {
    const scoreId = Number(req.params.scoreId);
    const deleteResult = await this.scoresService.deleteScore({
      id: scoreId,
    });
    if (!deleteResult.affected) {
      throw new HttpException(
        '삭제하려는 점수의 scoreId를 확인하십시오.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
