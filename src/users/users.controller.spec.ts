import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { createRequest, createResponse } from 'node-mocks-http';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { mockRepository } from './users.service.spec';

describe('UsersController', () => {
  let controller: UsersController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller.getProfile).toBeDefined();
    expect(controller.logout).toBeDefined();
  });

  it('should return a logined user', async () => {
    const mockReq = createRequest();
    mockReq.cookies = { refreshToken: 'profileTest' };
    const expectedUser = { email: 'test@existentEmail.com', name: 'john' };
    expect(await controller.getProfile(mockReq)).toEqual(expectedUser);
  });

  it('should be logged out', () => {
    const res = createResponse();
    res.cookies.refreshToken = { value: '', options: {} };
    const expectedResult = {
      cookies: {
        refreshToken: { options: { expires: new Date(1) } },
      },
    };
    expect(controller.logout(res)).toMatchObject(expectedResult);
  });
});
