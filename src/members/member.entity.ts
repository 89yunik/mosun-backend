import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Team } from 'src/teams/team.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team)
  @JoinColumn()
  team: Team;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ApiProperty()
  @Column({ type: 'varchar', length: 10 })
  authority: string;
}
