import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateScoreDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  point: number;
}
