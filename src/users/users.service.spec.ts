import { targetModulesByContainer } from '@nestjs/core/router/router-module';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

const users = [
  {
    email: 'test@existentEmail.com',
    name: 'john',
  },
  {
    email: 'existentUser@test.com',
    name: 'existentUser',
  },
];
export const mockRepository = {
  create: jest.fn((target) => target),
  save: jest.fn(),
  findOneBy: jest.fn(({ email }) => users.find((user) => user.email === email)),
};

describe('UsersService', () => {
  let service: UsersService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.createUser).toBeDefined();
    expect(service.readUserByEmail).toBeDefined();
    expect(service.readOrCreateUser).toBeDefined();
  });

  it('should return a created user', async () => {
    const validEmail = { email: 'test@validEmail.com', name: 'test' };
    expect(await service.createUser(validEmail)).toEqual(validEmail);

    const invalidEmail = { email: '@invalidEmail.com', name: 'test' };
    const expectedError = new Error(
      '생성하려는 이메일 형식이 유효하지 않습니다.',
    );
    expectedError.name = 'Unprocessable Entity';
    expect(
      await service.createUser(invalidEmail).catch((error) => {
        expect(error).toEqual(expectedError);
      }),
    ).toEqual(undefined);
  });

  it('should return a user with that email', async () => {
    const existentEmail = 'test@existentEmail.com';
    const expectedResult = {
      email: 'test@existentEmail.com',
      name: 'john',
    };
    expect(await service.readUserByEmail(existentEmail)).toEqual(
      expectedResult,
    );

    const nonExistentEmail = 'test@newEmail.com';
    expect(await service.readUserByEmail(nonExistentEmail)).toEqual(undefined);

    const invalidEmail = '@invalidEmail.com';
    const expectedError = new Error(
      '찾으려는 이메일 형식이 유효하지 않습니다.',
    );
    expectedError.name = 'Unprocessable Entity';
    expect(
      await service.readUserByEmail(invalidEmail).catch((error) => {
        expect(error).toEqual(expectedError);
      }),
    ).toEqual(undefined);
  });

  it('should return a user created or read', async () => {
    const newUser = { email: 'newUser@test.com', name: 'newUser' };
    expect(await service.readOrCreateUser(newUser)).toEqual(newUser);
    const existentUser = {
      email: 'existentUser@test.com',
      name: 'existentUser',
    };
    expect(await service.readOrCreateUser(existentUser)).toEqual(existentUser);
  });
});
