import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateMemberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authority: string;
}
