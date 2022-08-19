import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateMemberDto } from './dtos/create-member.dto';
import { Member } from './member.entity';
import { MembersService } from './members.service';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}
  @ApiOperation({
    summary: '팀원 생성 API',
    description: '',
  })
  @ApiBody({ type: CreateMemberDto, required: true })
  @ApiResponse({ status: 200, type: Member })
  @Post()
  @UseGuards(JwtAuthGuard)
  createMember(@Req() req: Request): Promise<Member> {
    const newMemberInfo = req.body;
    const newMember = this.membersService.createMember(newMemberInfo);
    return newMember;
  }

  @ApiOperation({
    summary: '소속팀 조회 API',
    description: '로그인된 사용자 정보로 소속된 팀을 조회한다.',
  })
  @ApiResponse({ status: 200, type: Member })
  @Get()
  @UseGuards(JwtAuthGuard)
  async readMembersOfUser(@Req() req: Request): Promise<Member[]> {
    const members = await this.membersService.readMembers({
      userId: req.user.id,
    });
    return members;
  }
}
