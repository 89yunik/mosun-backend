import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
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
import { Member } from './member.entity';
import { MembersService } from './members.service';

@ApiTags('Members')
@Controller('teams/:teamId/members')
export class MembersController {
  constructor(private membersService: MembersService) {}
  @ApiOperation({
    summary: '팀원 생성 API',
    description: '',
  })
  @ApiParam({ name: 'userId' })
  @ApiParam({ name: 'teamId' })
  @ApiBody({ type: CreateMemberDto, required: true })
  @ApiResponse({ status: 200, type: Member })
  @Post('users/:userId')
  @UseGuards(JwtAuthGuard)
  createMember(@Req() req: Request): Promise<Member> {
    const teamId = Number(req.params.teamId);
    const userId = Number(req.params.userId);
    const memberInfo = req.body;
    const member = this.membersService.createMember({
      teamId,
      userId,
      ...memberInfo,
    });
    return member;
  }

  @ApiOperation({
    summary: '팀원 검색 API',
    description: '검색어와 일치하는 팀원들을 조회한다.',
  })
  @ApiParam({ name: 'teamId' })
  @ApiResponse({ status: 200, type: Member, isArray: true })
  @Get('users')
  @UseGuards(JwtAuthGuard)
  readMembers(@Req() req: Request): Promise<Member[]> {
    const teamId = Number(req.params.teamId);
    const memberInfo = req.body;
    return this.membersService.readMembers({ teamId, ...memberInfo });
  }

  @ApiOperation({
    summary: '팀원 수정 API',
    description: '사용자가 관리하는 팀의 팀원 권한을 수정한다.',
  })
  @ApiParam({ name: 'memberId' })
  @ApiParam({ name: 'teamId' })
  @ApiBody({ type: CreateMemberDto })
  @ApiResponse({ status: 200 })
  @Put(':memberId')
  @UseGuards(JwtAuthGuard)
  async updateMember(@Req() req) {
    const teamId = Number(req.params.teamId);
    const userId = req.user.id;
    const admin = await this.membersService.readMember({
      userId,
      teamId,
    });
    if (admin) {
      if (admin.authority === 'admin') {
        const memberId = Number(req.params.memberId);
        const update = req.body;
        await this.membersService.updateMember({ id: memberId }, update);
      } else {
        throw new HttpException(
          '팀원 수정 권한이 없습니다.',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        '수정하려는 팀의 팀원이 아닙니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({
    summary: '팀원 삭제 API',
    description: '사용자가 관리하는 팀의 팀원을 삭제한다.',
  })
  @ApiParam({ name: 'memberId' })
  @ApiParam({ name: 'teamId' })
  @ApiResponse({ status: 200 })
  @Delete(':memberId')
  @UseGuards(JwtAuthGuard)
  async deleteMember(@Req() req) {
    const userId = req.user.id;
    const teamId = req.params.teamId;
    const admin = await this.membersService.readMember({
      userId,
      teamId,
    });
    if (admin) {
      if (admin.authority === 'admin') {
        const memberId = Number(req.params.memberId);
        this.membersService.deleteMember({ id: memberId });
      } else {
        throw new HttpException(
          '팀원 삭제 권한이 없습니다.',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        '삭제하려는 팀의 팀원이 아닙니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
