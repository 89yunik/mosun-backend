import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { createResponse } from 'node-mocks-http';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller.getProfile).toBeDefined();
    expect(controller.logout).toBeDefined();
  });

  it('should return a logined user', () => {
    const loginedUser = { email: 'loginedUser@test.com', name: 'loginedUser' };
    expect(controller.getProfile(loginedUser)).toEqual(loginedUser);
  });

  it('should be logged out', () => {
    const res = createResponse();
    res.cookies.accessToken = { value: '', options: {} };
    res.cookies.refreshToken = { value: '', options: {} };
    const expectedResult = {
      cookies: {
        accessToken: { options: { expires: new Date(1) } },
        refreshToken: { options: { expires: new Date(1) } },
      },
    };
    expect(controller.logout(res)).toMatchObject(expectedResult);
  });
});
