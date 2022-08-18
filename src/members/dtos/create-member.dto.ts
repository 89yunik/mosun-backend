import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  team: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authority: string;
}
