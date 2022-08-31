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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateMemberDto } from './dtos/create-member.dto';
import { UpdateMemberDto } from './dtos/update-member.dto';
import { Member } from './member.entity';
import { MembersService } from './members.service';

@ApiTags('Members')
@Controller('teams/:teamId')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @ApiOperation({ summary: '팀원 가입 API', description: '팀에 가입한다.' })
  @ApiParam({ name: 'teamId' })
  @ApiResponse({ status: 200 })
  @Post('members')
  @UseGuards(JwtAuthGuard)
  async createUserMember(@Req() req): Promise<void> {
    const teamId = Number(req.params.teamId);
    const userId = req.user.id;
    await this.membersService.createMember({
      teamId,
      userId,
      authority: 'user',
    });
  }

  @ApiOperation({
    summary: '팀원 검색 API',
    description: '검색어와 일치하는 팀원들을 조회한다.',
  })
  @ApiParam({ name: 'keyword' })
  @ApiParam({ name: 'teamId' })
  @ApiResponse({ status: 200, type: Member, isArray: true })
  @Get('members/:keyword')
  @UseGuards(JwtAuthGuard)
  readMembers(@Req() req: Request): Promise<Member[]> {
    const teamId = Number(req.params.teamId);
    const keyword = req.params.keyword;
    return this.membersService.readMembers({ teamId }, keyword);
  }

  @ApiOperation({ summary: '팀원 탈퇴 API', description: '팀에서 탈퇴한다.' })
  @ApiParam({ name: 'teamId' })
  @ApiResponse({ status: 200 })
  @Delete('members')
  deleteUserMember(@Req() req) {
    const teamId = req.params.teamId;
    const userId = req.user.id;
    this.membersService.deleteMember({ teamId, userId });
  }

  //팀 관리자 API
  @ApiOperation({
    summary: '(팀 관리자)팀원 추가 API',
    description:
      'teamId와 userId를 parameter로, 팀원 정보를 body로 받아 팀원을 추가한다.',
  })
  @ApiParam({ name: 'userId' })
  @ApiParam({ name: 'teamId' })
  @ApiBody({ type: CreateMemberDto, required: true })
  @ApiResponse({ status: 200 })
  @Post('users/:userId/members')
  @UseGuards(JwtAuthGuard)
  async createMember(@Req() req: Request): Promise<void> {
    const teamId = Number(req.params.teamId);
    const members = req.user.members;
    const admin = members.find(
      (member: Member) =>
        member.teamId === teamId && member.authority === 'admin',
    );
    if (admin) {
      const memberInfo = req.body;
      const userId = Number(req.params.userId);
      await this.membersService.createMember({
        teamId,
        userId,
        ...memberInfo,
      });
    } else {
      throw new HttpException(
        '팀원을 추가하려는 팀의 팀원이 아니거나, 팀원 추가 권한이 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @ApiOperation({
    summary: '(팀 관리자)팀원 수정 API',
    description: '사용자가 관리하는 팀의 팀원 권한을 수정한다.',
  })
  @ApiParam({ name: 'memberId' })
  @ApiParam({ name: 'teamId' })
  @ApiBody({ type: UpdateMemberDto })
  @ApiResponse({ status: 200 })
  @Put('members/:memberId')
  @UseGuards(JwtAuthGuard)
  async updateMember(@Req() req): Promise<void> {
    const teamId = Number(req.params.teamId);
    const members = req.user.members;
    const admin = members.find(
      (member: Member) =>
        member.teamId === teamId && member.authority === 'admin',
    );
    if (admin) {
      const memberId = Number(req.params.memberId);
      const update = req.body;
      const updateResult = await this.membersService.updateMember(
        { id: memberId, teamId },
        update,
      );
      if (!updateResult.affected) {
        throw new HttpException(
          'teamId와 수정하려는 팀원의 memberId를 확인하십시오.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        '팀원을 수정하려는 팀의 팀원이 아니거나, 팀원 수정 권한이 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @ApiOperation({
    summary: '(팀 관리자)팀원 삭제 API',
    description: '사용자가 관리하는 팀의 팀원을 삭제한다.',
  })
  @ApiParam({ name: 'memberId' })
  @ApiParam({ name: 'teamId' })
  @ApiResponse({ status: 200 })
  @Delete('members/:memberId')
  @UseGuards(JwtAuthGuard)
  async deleteMember(@Req() req): Promise<void> {
    const teamId = Number(req.params.teamId);
    const members = req.user.members;
    const admin = members.find(
      (member: Member) =>
        member.teamId === teamId && member.authority === 'admin',
    );
    if (admin) {
      const memberId = Number(req.params.memberId);
      const deleteResult = await this.membersService.deleteMember({
        id: memberId,
        teamId,
      });
      if (!deleteResult.affected) {
        throw new HttpException(
          'teamId와 삭제하려는 팀원의 memberId를 확인하십시오.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        '팀원을 삭제하려는 팀의 팀원이 아니거나, 팀원 삭제 권한이 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
