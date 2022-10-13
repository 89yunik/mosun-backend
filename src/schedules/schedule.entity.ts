import { ApiProperty } from '@nestjs/swagger';
import { Member } from 'src/members/member.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'memberId', update: false, nullable: true })
  memberId: number;
  @ManyToOne(() => Member, (member) => member.id, {
    cascade: true,
    onUpdate: 'SET NULL',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'memberId' })
  member: Member;

  @ApiProperty()
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty()
  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 20 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  description: string;
}
