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
@Controller('teams/:teamId/members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @ApiOperation({ summary: '팀원 가입 API', description: '팀에 가입한다.' })
  @ApiParam({ name: 'teamId' })
  @ApiResponse({ status: 200 })
  @Post()
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
  @ApiParam({ name: 'teamId' })
  @ApiResponse({ status: 200, type: Member, isArray: true })
  @Get()
  @UseGuards(JwtAuthGuard)
  readMembers(@Req() req: Request): Promise<Member[]> {
    const teamId = Number(req.params.teamId);
    const memberInfo = req.body;
    return this.membersService.readMembers({ teamId, ...memberInfo });
  }

  @ApiOperation({ summary: '팀원 탈퇴 API', description: '팀에서 탈퇴한다.' })
  @ApiParam({ name: 'teamId' })
  @ApiResponse({ status: 200 })
  @Delete()
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
  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  async createMember(@Req() req: Request): Promise<void> {
    const teamId = Number(req.params.teamId);
    const adminId = req.user.id;
    const admin = await this.membersService.readMember({
      userId: adminId,
      teamId,
    });
    if (admin) {
      if (admin.authority === 'admin') {
        const memberInfo = req.body;
        const userId = Number(req.params.userId);
        await this.membersService.createMember({
          teamId,
          userId,
          ...memberInfo,
        });
      } else {
        throw new HttpException(
          '사용자에게 팀원 추가 권한이 없습니다.',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        '사용자가 추가하려는 팀의 팀원이 아닙니다.',
        HttpStatus.BAD_REQUEST,
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
  @Put(':memberId')
  @UseGuards(JwtAuthGuard)
  async updateMember(@Req() req): Promise<void> {
    const teamId = Number(req.params.teamId);
    const userId = req.user.id;
    const admin = await this.membersService.readMember({
      userId,
      teamId,
    });
    if (admin) {
      if (admin.authority === 'admin') {
        const memberId = Number(req.params.memberId);
        const member = await this.membersService.readMember({ id: memberId });
        if (teamId === member.teamId) {
          const update = req.body;
          await this.membersService.updateMember({ id: memberId }, update);
        } else {
          throw new HttpException(
            '수정하려는 팀원이 팀에 소속돼 있지 않습니다.',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          '사용자에게 팀원 수정 권한이 없습니다.',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        '사용자가 수정하려는 팀의 팀원이 아닙니다.',
        HttpStatus.BAD_REQUEST,
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
  @Delete(':memberId')
  @UseGuards(JwtAuthGuard)
  async deleteMember(@Req() req): Promise<void> {
    const userId = req.user.id;
    const teamId = req.params.teamId;
    const admin = await this.membersService.readMember({
      userId,
      teamId,
    });
    if (admin) {
      if (admin.authority === 'admin') {
        const memberId = Number(req.params.memberId);
        const member = await this.membersService.readMember({ id: memberId });
        if (teamId === member.teamId) {
          await this.membersService.deleteMember({ id: memberId });
        } else {
          throw new HttpException(
            '삭제하려는 팀원이 팀에 소속돼 있지 않습니다.',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          '사용자에게 팀원 삭제 권한이 없습니다.',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        '사용자가 삭제하려는 팀의 팀원이 아닙니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
