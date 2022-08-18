import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateMemberDto } from './dtos/create-member.dto';
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
  @Post()
  @UseGuards(JwtAuthGuard)
  createMember(@Req() req: Request) {
    const memberInfo = req.body;
    this.membersService.createMember(memberInfo);
  }
}
