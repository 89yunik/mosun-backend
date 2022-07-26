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
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { UpdateScheduleDto } from './dtos/update-schedule.dto';
import { Schedule } from './schedule.entity';
import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @ApiOperation({
    summary: '일정 추가 API',
    description: '일정을 추가한다.',
  })
  @ApiBody({ type: CreateScheduleDto })
  @ApiResponse({ status: 201 })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createSchedule(@Req() req: Request): Promise<void> {
    const memberId = Number(req.body.memberId);
    const members = req.user.members;
    if (members.find((member) => member.id === memberId)) {
      const scheduleInfo: CreateScheduleDto = req.body;
      scheduleInfo.date = new Date(scheduleInfo.date);
      await this.schedulesService.createSchedule(scheduleInfo);
    } else {
      throw new HttpException(
        '사용자가 팀원이 아닙니다.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @ApiOperation({
    summary: '일정 검색 API',
    description: '검색 조건과 일치하는 일정들을 조회한다.',
  })
  @ApiQuery({ type: 'string', name: 'keyword', required: false })
  @ApiQuery({ type: 'number', name: 'memberId' })
  @ApiResponse({ status: 200 })
  @Get()
  @UseGuards(JwtAuthGuard)
  async readSchedules(@Req() req: Request): Promise<Schedule[]> {
    const memberId = Number(req.query.memberId);
    const members = req.user.members;
    if (members.find((member) => member.id === memberId)) {
      const keyword =
        typeof req.query.keyword === 'string' && req.query.keyword;
      const result = await this.schedulesService.readSchedules(keyword);
      return result;
    } else {
      throw new HttpException(
        '사용자가 팀원이 아닙니다.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @ApiOperation({
    summary: '(작성자)일정 수정 API',
    description: '사용자가 작성한 일정을 수정한다.',
  })
  @ApiParam({ type: 'number', name: 'scheduleId' })
  @ApiQuery({ type: 'number', name: 'memberId' })
  @ApiBody({ type: UpdateScheduleDto })
  @ApiResponse({ status: 200 })
  @Put(':scheduleId')
  @UseGuards(JwtAuthGuard)
  async updateSchedule(@Req() req: Request): Promise<void> {
    const scheduleId = Number(req.params.scheduleId);
    const memberId = Number(req.query.memberId);
    const scheduleInfo: UpdateScheduleDto = req.body;
    if (scheduleInfo.date) {
      scheduleInfo.date = new Date(scheduleInfo.date);
    }
    const updateResult = await this.schedulesService.updateSchedule(
      { id: scheduleId, memberId },
      scheduleInfo,
    );
    if (!updateResult.affected) {
      throw new HttpException(
        '수정하려는 일정의 memberId와 scheduleId를 확인하십시오.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({
    summary: '(작성자)일정 삭제 API',
    description: '사용자가 작성한 일정을 삭제한다.',
  })
  @ApiParam({ name: 'scheduleId' })
  @ApiQuery({ type: 'number', name: 'memberId' })
  @ApiResponse({ status: 200 })
  @Delete(':scheduleId')
  @UseGuards(JwtAuthGuard)
  async deleteSchedule(@Req() req: Request): Promise<void> {
    const scheduleId = Number(req.params.scheduleId);
    const memberId = Number(req.query.memberId);
    const deleteResult = await this.schedulesService.deleteSchedule({
      id: scheduleId,
      memberId,
    });
    if (!deleteResult.affected) {
      throw new HttpException(
        '삭제하려는 일정의 memberId와 scheduleId를 확인하십시오.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
