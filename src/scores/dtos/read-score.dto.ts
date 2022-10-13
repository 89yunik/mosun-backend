import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { PeriodDto } from './period.dto';

export class ReadScoreDto {
  @ApiProperty({ required: false })
  @IsDate()
  period: PeriodDto;

  @ApiProperty({ required: false, example: 'offline' })
  @IsString()
  type: string;

  @ApiProperty({ required: false })
  @IsNumber()
  memberId: number;
}
