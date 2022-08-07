import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { createResponse } from 'node-mocks-http';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller.googleLogin).toBeDefined();
    expect(controller.googleCallback).toBeDefined();
    expect(controller.kakaoLogin).toBeDefined();
    expect(controller.kakaoCallback).toBeDefined();
  });

  it('should create jwt tokens', () => {
    const googleUser = { email: 'test@google.com', name: 'test' };
    const kakaoUser = { email: 'test@kakao.com', name: 'test' };
    const res = createResponse();
    const expectedResult = {
      cookies: {
        accessToken: {
          options: {
            httpOnly: true,
            maxAge: Number(process.env.JWT_ACCESS_EXP) * 60 * 1000,
          },
        },
        refreshToken: {
          options: {
            httpOnly: true,
            maxAge: Number(process.env.JWT_REFRESH_EXP) * 60 * 60 * 1000,
          },
        },
      },
    };
    expect(controller.googleCallback(googleUser, res)).toMatchObject(
      expectedResult,
    );
    expect(controller.kakaoCallback(kakaoUser, res)).toMatchObject(
      expectedResult,
    );
  });
});
