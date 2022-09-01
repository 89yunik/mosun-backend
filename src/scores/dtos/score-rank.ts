import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ScoreRank {
  @ApiProperty()
  @IsString()
  memberName: string;

  @ApiProperty()
  @IsNumber()
  totalScore: string;

  @ApiProperty()
  @IsNumber()
  rank: number;
}
