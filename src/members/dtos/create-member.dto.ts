import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  teamId: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authority: string;
}
