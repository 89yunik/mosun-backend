import { Controller, Get, UseGuards, HttpCode, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request, Response } from 'express';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

declare global {
  namespace Express {
    interface Request {
      user: Partial<User>;
    }
  }
}

class AccessToken {
  @ApiProperty()
  accessToken: string;
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
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
    description: '로그인된 사용자 정보로 쿠키를 생성한다.',
  })
  @ApiResponse({ status: 200, description: 'accessToken', type: AccessToken })
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(200)
  googleCallback(@Req() req: Request, @Res() res: Response): Response {
    const user = req.user;
    const refreshExp = Number(process.env.JWT_REFRESH_EXP);
    const accessExp = Number(process.env.JWT_ACCESS_EXP);
    const accessToken = this.authService.setToken('access', user);
    const refreshToken = this.authService.setToken('refresh');
    this.usersService.updateUser(user, { refreshToken });
    res.cookie('refreshToken', refreshToken, {
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
    description: '로그인된 사용자 정보로 쿠키를 생성한다.',
  })
  @ApiResponse({ status: 200, description: 'accessToken', type: AccessToken })
  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  @HttpCode(200)
  kakaoCallback(@Req() req: Request, @Res() res: Response): Response {
    const user = req.user;
    const refreshExp = Number(process.env.JWT_REFRESH_EXP);
    const accessExp = Number(process.env.JWT_ACCESS_EXP);
    const accessToken = this.authService.setToken('access', user);
    const refreshToken = this.authService.setToken('refresh');
    this.usersService.updateUser(user, { refreshToken });
    res.cookie('refreshToken', refreshToken, {
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
    description: '토큰을 재발급한다.',
  })
  @ApiResponse({ status: 200, description: 'accessToken', type: AccessToken })
  @Get('accessToken')
  // @UseGuards(JwtAuthGuard)
  async getAccessToken(@Req() req, @Res() res) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const accessExp = Number(process.env.JWT_ACCESS_EXP);
      const user = await this.usersService.readUser({ refreshToken });
      const accessToken = this.authService.setToken('access', user);
      res
        .cookie('accessToken', accessToken, {
          maxAge: accessExp * 60 * 1000,
          sameSite: 'strict',
          httpOnly: true,
          secure: true,
        })
        .redirect(process.env.AUTH_REDIRECT);
    }
  }
}
