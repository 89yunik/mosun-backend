import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

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

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.setToken).toBeDefined();
  });

  it('should return a jwt token', () => {
    const expected = {
      id: 1,
      email: 'loginedUser@jwt.com',
      name: 'loginedUser',
    };
    const loginedUser = {
      ...expected,
      refreshToken: '',
    };
    let jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_BASIC_EXP}m` },
    });

    expect(
      jwtService.verify(service.setToken('access', loginedUser)),
    ).toMatchObject(expected);
    expect(
      jwtService.verify(service.setToken('refresh', loginedUser)),
    ).toBeDefined();
  });
});
