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
import { CreateMemberDto } from './dtos/create-member.dto';
import { UpdateMemberDto } from './dtos/update-member.dto';
import { Member } from './member.entity';
import { MembersService } from './members.service';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @ApiOperation({ summary: '팀원 가입 API', description: '팀에 가입한다.' })
  @ApiQuery({ type: 'number', name: 'teamId' })
  @ApiResponse({ status: 201 })
  @Post('sign-up')
  @UseGuards(JwtAuthGuard)
  async createUserMember(@Req() req): Promise<void> {
    const teamId = Number(req.query.teamId);
    const userId = req.user.id;
    await this.membersService.createMember({
      teamId,
      userId,
      authority: 'user',
    });
  }

  @ApiOperation({
    summary: '팀원 검색 API',
    description: 'keyword와 일치하는 팀원들을 조회한다.',
  })
  @ApiQuery({ type: 'string', name: 'keyword', required: false })
  @ApiQuery({ type: 'number', name: 'teamId' })
  @ApiResponse({ status: 200, type: Member, isArray: true })
  @Get()
  @UseGuards(JwtAuthGuard)
  readMembers(@Req() req: Request): Promise<Member[]> {
    const teamId = Number(req.query.teamId);
    const keyword = typeof req.query.keyword === 'string' && req.query.keyword;
    const readResult = this.membersService.readMembers(teamId, keyword);
    return readResult;
  }

  @ApiOperation({ summary: '팀원 탈퇴 API', description: '팀에서 탈퇴한다.' })
  @ApiQuery({ type: 'number', name: 'teamId' })
  @ApiResponse({ status: 200 })
  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteUserMember(@Req() req) {
    const teamId = Number(req.query.teamId);
    const userId = req.user.id;
    this.membersService.deleteMember({ teamId, userId });
  }

  //팀 관리자 API
  @ApiOperation({
    summary: '(팀 관리자)팀원 추가 API',
    description: 'teamId와 userId, 팀원 정보를 받아 팀원을 추가한다.',
  })
  @ApiQuery({ type: 'number', name: 'userId' })
  @ApiQuery({ type: 'number', name: 'teamId' })
  @ApiBody({ type: CreateMemberDto, required: true })
  @ApiResponse({ status: 201 })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createMember(@Req() req: Request): Promise<void> {
    const teamId = Number(req.query.teamId);
    const members = req.user.members;
    const admin = members.find(
      (member: Member) =>
        member.teamId === teamId && member.authority === 'admin',
    );
    if (admin) {
      const memberInfo: CreateMemberDto = req.body;
      const userId = Number(req.query.userId);
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
  @ApiQuery({ type: 'number', name: 'teamId' })
  @ApiBody({ type: UpdateMemberDto })
  @ApiResponse({ status: 200 })
  @Put(':memberId')
  @UseGuards(JwtAuthGuard)
  async updateMember(@Req() req: Request): Promise<void> {
    const teamId = Number(req.query.teamId);
    const members = req.user.members;
    const admin = members.find(
      (member: Member) =>
        member.teamId === teamId && member.authority === 'admin',
    );
    if (admin) {
      const memberId = Number(req.params.memberId);
      const update: UpdateMemberDto = req.body;
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
  @ApiQuery({ type: 'number', name: 'teamId' })
  @ApiResponse({ status: 200 })
  @Delete(':memberId')
  @UseGuards(JwtAuthGuard)
  async deleteMember(@Req() req: Request): Promise<void> {
    const teamId = Number(req.query.teamId);
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
