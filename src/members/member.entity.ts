import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Team } from 'src/teams/team.entity';

@Entity()
@Unique(['teamId', 'userId'])
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'teamId', update: false })
  teamId: number;
  @ManyToOne(() => Team, (team) => team.id, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @ApiProperty()
  @Column({ name: 'userId', update: false })
  userId: number;
  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User['id'];

  @ApiProperty()
  @Column({ type: 'varchar', length: 10 })
  authority: string;

  @ApiProperty()
  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 20 })
  name: string;
}
