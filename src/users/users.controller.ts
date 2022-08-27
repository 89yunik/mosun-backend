import {
  Controller,
  Delete,
  Get,
  Param,
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
import { LoginedUser } from 'src/auth/auth.controller';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: '사용자 프로필 API',
    description: '로그인된 사용자 프로필을 가져온다.',
  })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  readLoginedUser(@Req() req: Request): Partial<LoginedUser> {
    if (req.user) {
      const { email, name, members } = req.user;
      return { email, name, members };
    }
  }

  @ApiOperation({
    summary: '사용자 검색 API',
    description: '검색어와 일치하는 사용자들을 조회한다.',
  })
  @ApiParam({ name: 'keyword' })
  @ApiResponse({ status: 200, type: User, isArray: true })
  @Get(':keyword')
  @UseGuards(JwtAuthGuard)
  readUsers(@Req() req: Request): Promise<User[]> {
    const keyword = req.params.keyword;
    return this.usersService.readUsers(keyword);
  }

  @ApiOperation({
    summary: '회원 정보 수정 API',
    description: '로그인된 사용자 정보를 수정한다.',
  })
  @ApiBody({ type: UpdateUserDto, required: true })
  @ApiResponse({ status: 200 })
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateLoginedUser(@Req() req): Promise<void> {
    const id = req.user.id;
    const update = req.body;
    this.usersService.updateUser({ id }, update);
  }

  @ApiOperation({
    summary: '회원 탈퇴 API',
    description: '로그인된 사용자 정보를 삭제한다.',
  })
  @ApiResponse({ status: 200 })
  @Delete('profile')
  @UseGuards(JwtAuthGuard)
  async deleteLoginedUser(@Req() req): Promise<void> {
    const id = req.user.id;
    this.usersService.deleteUser({ id });
  }
}
