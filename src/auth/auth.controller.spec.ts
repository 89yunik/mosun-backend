import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createRequest, createResponse } from 'node-mocks-http';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { mockRepository } from 'src/users/users.service.spec';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
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
    const req = createRequest();

    const res = createResponse();
    const expectedResult = {
      cookies: {
        refreshToken: {
          options: {
            httpOnly: true,
            maxAge: Number(process.env.JWT_REFRESH_EXP) * 60 * 60 * 1000,
          },
        },
      },
    };
    req.user = { email: 'test@google.com', name: 'test' };
    expect(controller.googleCallback(req, res)).toMatchObject(expectedResult);
    req.user = { email: 'test@kakao.com', name: 'test' };
    expect(controller.kakaoCallback(req, res)).toMatchObject(expectedResult);
  });
});
