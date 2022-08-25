import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRecordDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  score: number;
}
