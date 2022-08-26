import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRecordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;
}
