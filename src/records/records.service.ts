import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateRecordDto } from './dtos/create-record.dto';
import { UpdateRecordDto } from './dtos/update-record.dto';
import { Record } from './record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordsRepository: Repository<Record>,
  ) {}
  async createRecord(target: CreateRecordDto): Promise<Record> {
    const record = this.recordsRepository.create(target);
    await this.recordsRepository.save(record);
    return record;
  }

  async readRecords(options?: Partial<Record>): Promise<Record[]> {
    return this.recordsRepository.findBy(options);
  }
  async updateRecord(
    target: Partial<Record>,
    update: UpdateRecordDto,
  ): Promise<UpdateResult> {
    const updateResult = await this.recordsRepository.update(target, update);
    return updateResult;
  }

  async deleteRecord(target: Partial<Record>): Promise<DeleteResult> {
    const deleteResult = await this.recordsRepository.delete(target);
    return deleteResult;
  }
}
