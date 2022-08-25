import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateRecordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;
}
