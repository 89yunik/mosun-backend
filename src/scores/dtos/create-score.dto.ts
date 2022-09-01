import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScoreDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  memberId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  recordId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  point: number;
}
