import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ): Promise<void> {
    await this.schedulesRepository.update(target, update);
  }

  async deleteSchedule(target: Partial<Schedule>): Promise<void> {
    await this.schedulesRepository.delete(target);
  }
}
