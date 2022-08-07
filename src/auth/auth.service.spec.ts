import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.setToken).toBeDefined();
  });

  it('should return a jwt token', () => {
    const loginedUser = { email: 'loginedUser@jwt.com', name: 'loginedUser' };
    let jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_BASIC_EXP}m` },
    });

    expect(
      jwtService.verify(service.setToken('access', loginedUser)),
    ).toMatchObject(loginedUser);
    expect(
      jwtService.verify(service.setToken('refresh', loginedUser)),
    ).toBeDefined();
  });
});
