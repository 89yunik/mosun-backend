import { Schedule } from 'src/schedules/schedule.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'scheduleId', update: false })
  scheduleId: number;
  @ManyToOne(() => Schedule, (schedule) => schedule.id, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedule;

  @Column({ type: 'varchar', length: 10 })
  type: string;
}
