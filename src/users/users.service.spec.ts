import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

const users = [
  {
    email: 'test@existentEmail.com',
    name: 'john',
    refreshToken: 'profileTest',
  },
  {
    email: 'existentUser@test.com',
    name: 'existentUser',
  },
];
export const mockRepository = {
  create: jest.fn((target) => target),
  save: jest.fn(),
  findOneBy: jest.fn((target) => {
    if (target.email) {
      return users.find((user) => user.email === target.email);
    } else if (target.refreshToken) {
      return users.find((user) => user.refreshToken === target.refreshToken);
    }
  }),
  update: jest.fn((target, update) => {
    const user = users.find((user) => user.email === target.email);
    return { ...user, ...update };
  }),
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
    expect(service.readUser).toBeDefined();
    expect(service.readOrCreateUser).toBeDefined();
  });

  it('should return a created user', async () => {
    const validEmail = { email: 'test@validEmail.com', name: 'test' };
    expect(await service.createUser(validEmail)).toEqual(validEmail);
  });

  it('should return a user with that email', async () => {
    const existentEmail = 'test@existentEmail.com';
    const expectedResult = {
      email: 'test@existentEmail.com',
      name: 'john',
    };
    expect(await service.readUser({ email: existentEmail })).toEqual(
      expectedResult,
    );

    const nonExistentEmail = 'test@newEmail.com';
    expect(await service.readUser({ email: nonExistentEmail })).toEqual(
      undefined,
    );
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
  it('should update a user', async () => {
    const target = { email: 'test@existentEmail.com' };
    const update = { name: 'test', refreshToken: 'test' };
    expect(await service.updateUser(target, update));
  });
});
