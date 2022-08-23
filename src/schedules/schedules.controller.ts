import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { UpdateScheduleDto } from './dtos/update-schedule.dto';
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
  @ApiResponse({ status: 200 })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createSchedule(@Req() req: Request): Promise<void> {
    const scheduleInfo = req.body;
    await this.schedulesService.createSchedule(scheduleInfo);
  }

  @ApiOperation({
    summary: '일정 검색 API',
    description: '검색어와 일치하는 일정들을 조회한다.',
  })
  //   @ApiBody({ type: Schedule })
  @ApiResponse({ status: 200 })
  @Get()
  @UseGuards(JwtAuthGuard)
  async readSchedules(@Req() req: Request): Promise<void> {
    // const options = req.body;
    await this.schedulesService.readSchedules();
  }

  @ApiOperation({
    summary: '(작성자)일정 수정 API',
    description: '사용자가 작성한 일정을 수정한다.',
  })
  @ApiParam({ name: 'scheduleId' })
  @ApiBody({ type: UpdateScheduleDto })
  @ApiResponse({ status: 200 })
  @Put(':scheduleId')
  @UseGuards(JwtAuthGuard)
  async updateSchedule(@Req() req): Promise<void> {
    const scheduleId = Number(req.params.scheduleId);
    const update = req.body;
    await this.schedulesService.updateSchedule({ id: scheduleId }, update);
  }

  @ApiOperation({
    summary: '(작성자)일정 삭제 API',
    description: '사용자가 작성한 일정을 삭제한다.',
  })
  @ApiParam({ name: 'scheduleId' })
  @ApiResponse({ status: 200 })
  @Delete(':scheduleId')
  @UseGuards(JwtAuthGuard)
  async deleteSchedule(@Req() req): Promise<void> {
    const scheduleId = Number(req.params.scheduleId);
    this.schedulesService.deleteSchedule({ id: scheduleId });
  }
}
