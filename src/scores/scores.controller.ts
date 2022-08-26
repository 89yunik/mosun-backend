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
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateScoreDto } from './dtos/create-score.dto';
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
  @ApiResponse({ status: 200 })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createScore(@Req() req: Request): Promise<void> {
    const scoreInfo = req.body;
    await this.scoresService.createScore(scoreInfo);
  }

  @ApiOperation({
    summary: '점수 검색 API',
    description: '검색 조건과 일치하는 점수들을 조회한다.',
  })
  @ApiResponse({ status: 200 })
  @Get()
  @UseGuards(JwtAuthGuard)
  async readScore(@Req() req: Request): Promise<Score[]> {
    const result = await this.scoresService.readScores();
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
    const scoreInfo = req.body;
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
