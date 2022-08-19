import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @ApiOperation({
    summary: '사용자 검색 API',
    description: '검색어와 일치하는 사용자들을 조회한다.',
  })
  @ApiParam({ name: 'keyword', required: false })
  @ApiResponse({ status: 200, type: User, isArray: true })
  @Get()
  @UseGuards(JwtAuthGuard)
  searchUsers(@Param() param) {
    return this.usersService.readUsers(param.keyword);
  }

  @ApiOperation({
    summary: '사용자 프로필 API',
    description: '로그인된 사용자 프로필을 가져온다.',
  })
  @ApiResponse({ status: 200, type: User })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    const { email, name } = req.user;
    return { email, name };
  }
}
