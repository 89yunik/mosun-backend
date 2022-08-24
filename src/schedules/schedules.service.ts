import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { UpdateScheduleDto } from './dtos/update-schedule.dto';
import { Schedule } from './schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
  ) {}

  async createSchedule(target: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.schedulesRepository.create(target);
    await this.schedulesRepository.save(schedule);
    return schedule;
  }

  async readSchedules(options?: Partial<Schedule>): Promise<Schedule[]> {
    return this.schedulesRepository.findBy(options);
  }
  async updateSchedule(
    target: Partial<Schedule>,
    update: UpdateScheduleDto,
  ): Promise<UpdateResult> {
    const updateResult = await this.schedulesRepository.update(target, update);
    return updateResult;
  }

  async deleteSchedule(target: Partial<Schedule>): Promise<DeleteResult> {
    const deleteResult = await this.schedulesRepository.delete(target);
    return deleteResult;
  }
}
