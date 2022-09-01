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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateRecordDto } from './dtos/create-record.dto';
import { UpdateRecordDto } from './dtos/update-record.dto';
import { Record } from './record.entity';
import { RecordsService } from './records.service';

@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(private recordsService: RecordsService) {}

  @ApiOperation({
    summary: '전적 추가 API',
    description: '전적을 추가한다.',
  })
  @ApiBody({ type: CreateRecordDto })
  @ApiResponse({ status: 201 })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createRecord(@Req() req: Request): Promise<void> {
    const recordInfo: CreateRecordDto = req.body;
    await this.recordsService.createRecord(recordInfo);
  }

  @ApiOperation({
    summary: '전적 조회 API',
    description: '검색 조건과 일치하는 전적들을 조회한다.',
  })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'scheduleId' })
  @ApiResponse({ status: 200 })
  @Get()
  @UseGuards(JwtAuthGuard)
  async readRecords(@Req() req: Request): Promise<Record[]> {
    const scheduleId = Number(req.query.scheduleId);
    const type = typeof req.query.type === 'string' && req.query.type;
    const result = await this.recordsService.readRecords({ scheduleId, type });
    return result;
  }

  @ApiOperation({
    summary: '전적 수정 API',
    description: '전적을 수정한다.',
  })
  @ApiParam({ name: 'recordId' })
  @ApiBody({ type: UpdateRecordDto })
  @ApiResponse({ status: 200 })
  @Put(':recordId')
  @UseGuards(JwtAuthGuard)
  async updateRecord(@Req() req: Request): Promise<void> {
    const recordId = Number(req.params.recordId);
    const recordInfo: UpdateRecordDto = req.body;
    const updateResult = await this.recordsService.updateRecord(
      { id: recordId },
      recordInfo,
    );
    if (!updateResult.affected) {
      throw new HttpException(
        '수정하려는 전적의 recordId를 확인하십시오.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({
    summary: '전적 삭제 API',
    description: '전적을 삭제한다.',
  })
  @ApiParam({ name: 'recordId' })
  @ApiResponse({ status: 200 })
  @Delete(':recordId')
  @UseGuards(JwtAuthGuard)
  async deleteRecord(@Req() req: Request): Promise<void> {
    const recordId = Number(req.params.recordId);
    const deleteResult = await this.recordsService.deleteRecord({
      id: recordId,
    });
    if (!deleteResult.affected) {
      throw new HttpException(
        '삭제하려는 전적의 recordId를 확인하십시오.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
