import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTeamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
