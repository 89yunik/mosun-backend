import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 20 })
  name: string;
}
