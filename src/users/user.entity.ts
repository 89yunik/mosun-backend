import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  refresh_token: string;
}
