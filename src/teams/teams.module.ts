import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/member.entity';
import { MembersService } from 'src/members/members.service';
import { Team } from './team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    TypeOrmModule.forFeature([Member]),
  ],
  controllers: [TeamsController],
  providers: [TeamsService, MembersService],
})
export class TeamsModule {}
