import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  Res,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MembersService } from 'src/members/members.service';
import { Member } from 'src/members/member.entity';

export interface LoginedUser {
  id: number;
  email: string;
  name: string;
  members: Member[];
}
declare global {
  namespace Express {
    interface Request {
      user: LoginedUser;
    }
  }
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private membersService: MembersService,
  ) {}

  @ApiOperation({
    summary: '구글 로그인 API',
    description:
      '구글 로그인 창을 불러온다. 로그인에 성공하면 google/callback으로 이동한다.',
  })
  @ApiResponse({ status: 200 })
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin(): void {}

  @ApiOperation({
    summary: '구글 로그인 콜백 API',
    description: '로그인된 사용자의 jwt token으로 쿠키를 생성한다.',
  })
  @ApiResponse({ status: 200 })
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(200)
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const user = req.user;
    const refreshExp = Number(process.env.JWT_REFRESH_EXP);
    const accessExp = Number(process.env.JWT_ACCESS_EXP);
    const members = await this.membersService.readMembersOfUser({
      userId: user.id,
    });
    const refreshToken = this.authService.setToken('refresh');
    this.usersService.updateUser(user, { refreshToken });
    user.members = members;
    const accessToken = this.authService.setToken('access', user);
    res.cookie('refreshToken', user.id, {
      maxAge: refreshExp * 60 * 60 * 1000,
      sameSite: 'strict',
      httpOnly: true,
      secure: true,
    });
    res
      .cookie('accessToken', accessToken, {
        maxAge: accessExp * 60 * 1000,
        sameSite: 'strict',
        httpOnly: true,
        secure: true,
      })
      .redirect(process.env.AUTH_REDIRECT);
    return res;
  }

  @ApiOperation({
    summary: '카카오 로그인 API',
    description:
      '카카오 로그인 창을 불러온다. 로그인에 성공하면 kakao/callback으로 이동한다.',
  })
  @ApiResponse({ status: 200 })
  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  kakaoLogin(): void {}

  @ApiOperation({
    summary: '카카오 로그인 콜백 API',
    description: '로그인된 사용자의 jwt token으로 쿠키를 생성한다.',
  })
  @ApiResponse({ status: 200 })
  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  @HttpCode(200)
  async kakaoCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const user = req.user;
    const refreshExp = Number(process.env.JWT_REFRESH_EXP);
    const accessExp = Number(process.env.JWT_ACCESS_EXP);
    const members = await this.membersService.readMembersOfUser({
      userId: user.id,
    });
    const refreshToken = this.authService.setToken('refresh');
    this.usersService.updateUser(user, { refreshToken });
    user.members = members;
    const accessToken = this.authService.setToken('access', user);
    res.cookie('refreshToken', user.id, {
      maxAge: refreshExp * 60 * 60 * 1000,
      sameSite: 'strict',
      httpOnly: true,
      secure: true,
    });
    res
      .cookie('accessToken', accessToken, {
        maxAge: accessExp * 60 * 1000,
        sameSite: 'strict',
        httpOnly: true,
        secure: true,
      })
      .redirect(process.env.AUTH_REDIRECT);
    return res;
  }

  @ApiOperation({
    summary: 'accessToken 재발급 API',
    description: 'jwt accessToken을 재발급한다.',
  })
  @ApiResponse({ status: 200 })
  @Get('access-token')
  async getAccessToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const id: number = req.cookies.refreshToken;
    if (id) {
      const accessExp = Number(process.env.JWT_ACCESS_EXP);
      const user: Partial<LoginedUser> = await this.usersService.readUser({
        id,
      });
      const members = await this.membersService.readMembersOfUser({
        userId: user.id,
      });
      user.members = members;
      const accessToken = this.authService.setToken('access', user);
      res
        .cookie('accessToken', accessToken, {
          maxAge: accessExp * 60 * 1000,
          sameSite: 'strict',
          httpOnly: true,
          secure: true,
        })
        .redirect(process.env.AUTH_REDIRECT);
    } else {
      throw new HttpException(
        'refreshToken이 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({
    summary: '로그아웃 API',
    description: '사용자를 로그아웃한다.',
  })
  @ApiResponse({ status: 200 })
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response): Response {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken').redirect(process.env.AUTH_REDIRECT);
    return res;
  }
}
