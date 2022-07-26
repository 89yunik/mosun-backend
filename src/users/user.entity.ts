import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50, unique: true, update: false })
  email: string;

  @ApiProperty()
  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string;
}
