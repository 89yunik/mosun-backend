import { ApiProperty } from '@nestjs/swagger';
import { Member } from 'src/members/member.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'memberId', update: false })
  memberId: number;
  @ManyToOne(() => Member, (member) => member.id, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  member: Member;

  @ApiProperty()
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  description: string;
}
