import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PeriodDto {
  @ApiProperty({ example: '2022-10-13 10:15:55' })
  @IsString()
  @IsNotEmpty()
  start: string;

  @ApiProperty({ example: '2022-10-13 14:15:55' })
  @IsString()
  @IsNotEmpty()
  end: string;
}
