import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
// import { TeamUser } from './team_user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    // TypeOrmModule.forFeature([GroupUser]),
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
