import { Member } from 'src/members/member.entity';
import { Record } from 'src/records/record.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'memberId', update: false })
  memberId: number;
  @ManyToOne(() => Member, (member) => member.id, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  member: Member;

  @Column({ name: 'recordId', update: false })
  recordId: number;
  @ManyToOne(() => Record, (record) => record.id, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recordId' })
  record: Record;

  @Column({ type: 'integer' })
  point: number;
}
