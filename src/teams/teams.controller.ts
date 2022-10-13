import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Member } from 'src/members/member.entity';
import { MembersService } from 'src/members/members.service';
import { CreateTeamDto } from './dtos/create-team.dto';
import { UpdateTeamDto } from './dtos/update-team.dto';
import { Team } from './team.entity';
import { TeamsService } from './teams.service';
@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(
    private teamsService: TeamsService,
    private membersService: MembersService,
  ) {}

  @ApiOperation({
    summary: '팀 생성 API',
    description: '팀을 생성한다.',
  })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({ status: 201 })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createTeam(@Req() req: Request): Promise<void> {
    const teamInfo: CreateTeamDto = req.body;
    const team = await this.teamsService.createTeam(teamInfo);
    await this.membersService.createMember({
      teamId: team.id,
      userId: req.user.id,
      authority: 'admin',
      name: req.user.name,
    });
  }

  @ApiOperation({
    summary: '소속팀 조회 API',
    description: '로그인된 사용자 정보로 소속된 팀을 조회한다.',
  })
  @ApiResponse({ status: 200, type: Member })
  @Get('joined')
  @UseGuards(JwtAuthGuard)
  async readTeamsOfUser(@Req() req: Request): Promise<Member[]> {
    const members = req.user.members;
    return members;
  }

  @ApiOperation({
    summary: '팀 검색 API',
    description: 'keyword와 일치하는 팀들을 조회한다.',
  })
  @ApiQuery({ type: 'string', name: 'keyword', required: false })
  @ApiResponse({ status: 200, type: Team, isArray: true })
  @Get()
  @UseGuards(JwtAuthGuard)
  readTeams(@Req() req: Request): Promise<Team[]> {
    const keyword = typeof req.query.keyword === 'string' && req.query.keyword;
    return this.teamsService.readTeams(keyword);
  }

  @ApiOperation({
    summary: '(팀 관리자)팀 수정 API',
    description: '사용자가 관리하는 팀 정보를 수정한다.',
  })
  @ApiParam({ name: 'teamId' })
  @ApiBody({ type: UpdateTeamDto })
  @ApiResponse({ status: 200 })
  @Put(':teamId')
  @UseGuards(JwtAuthGuard)
  async updateTeam(@Req() req: Request): Promise<void> {
    const teamId = Number(req.params.teamId);
    const members = req.user.members;
    const admin = members.find(
      (member: Member) =>
        member.teamId === teamId && member.authority === 'admin',
    );
    if (admin) {
      const update: UpdateTeamDto = req.body;
      await this.teamsService.updateTeam({ id: teamId }, update);
    } else {
      throw new HttpException(
        '수정하려는 팀의 팀원이 아니거나, 팀 수정 권한이 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @ApiOperation({
    summary: '(팀 관리자)팀 삭제 API',
    description: '사용자가 관리하는 팀을 삭제한다.',
  })
  @ApiParam({ name: 'teamId' })
  @ApiResponse({ status: 200 })
  @Delete(':teamId')
  @UseGuards(JwtAuthGuard)
  async deleteTeam(@Req() req: Request): Promise<void> {
    const teamId = Number(req.params.teamId);
    const members = req.user.members;
    const admin = members.find(
      (member: Member) =>
        member.teamId === teamId && member.authority === 'admin',
    );
    if (admin) {
      this.teamsService.deleteTeam({ id: teamId });
    } else {
      throw new HttpException(
        '삭제하려는 팀의 팀원이 아니거나, 팀 삭제 권한이 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
