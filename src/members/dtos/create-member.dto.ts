import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsNumber()
  @IsNotEmpty()
  teamId: number;
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authority: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
