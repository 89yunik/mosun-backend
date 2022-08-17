import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTeamDto } from './dtos/create-team.dto';
import { Team } from './team.entity';
import { TeamsService } from './teams.service';
@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}
  @ApiOperation({
    summary: '팀 생성 API',
    description: 'req.body.newTeamInfo와 로그인된 사용자 정보로 팀을 생성한다.',
  })
  @ApiBody({ type: CreateTeamDto, required: true })
  @ApiResponse({ status: 200, type: Team })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createTeam(@Req() req: Request): Promise<Partial<Team>> {
    const newTeamInfo = req.body;
    const newTeam = await this.teamsService.createTeamOfUser(
      newTeamInfo,
      req.user.id,
    );
    return newTeam;
  }
}
