import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNumber()
  @IsNotEmpty()
  memberId: number;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
