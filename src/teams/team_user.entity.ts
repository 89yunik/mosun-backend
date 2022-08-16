// import { ApiProperty } from '@nestjs/swagger';
// import { User } from 'src/users/user.entity';
// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { Team } from './team.entity';

// @Entity()
// export class TeamUser {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => Team)
//   @JoinColumn()
//   group_id: Team['id'];

//   @ManyToOne(() => User)
//   @JoinColumn()
//   user_id: User['id'];

//   @ApiProperty()
//   @Column({ type: 'varchar', length: 10 })
//   authority: string;
// }
