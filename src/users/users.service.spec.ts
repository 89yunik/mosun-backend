import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.createUser).toBeDefined();
    expect(service.readUserByEmail).toBeDefined();
  });

  it('should return a created user', async () => {
    const validEmail = { email: 'test@test.com', name: 'test' };
    expect(await service.createUser(validEmail)).toEqual(validEmail);

    const invalidEmail = { email: '@test.com', name: 'test' };
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
    const existentEmail = 'changeme@test.com';
    const result1 = {
      email: 'changeme@test.com',
      name: 'john',
    };
    expect(await service.readUserByEmail(existentEmail)).toEqual(result1);

    const nonExistentEmail = 'test@test.com';
    expect(await service.readUserByEmail(nonExistentEmail)).toEqual(undefined);

    const invalidEmail = '@test.com';
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
});
