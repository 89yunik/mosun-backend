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

  @ApiProperty()
  @Column({ name: 'teamId' })
  teamId: number;
  @ManyToOne(() => Team)
  @JoinColumn({ name: 'teamId' })
  team: Team['id'];

  @ApiProperty()
  @Column({ name: 'userId' })
  userId: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User['id'];

  @ApiProperty()
  @Column({ type: 'varchar', length: 10 })
  authority: string;
}
