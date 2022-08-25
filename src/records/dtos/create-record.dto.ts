import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRecordDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  scheduleId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;
}
