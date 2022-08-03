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
  });

  it('should return a created user', async () => {
    const target = { email: 'test', name: 'test' };
    expect(await service.createUser(target)).toEqual(target);
  });

  it('should return a user with that email', async () => {
    const target = { email: 'changeme@test.com' };
    const result = {
      email: 'changeme@test.com',
      name: 'john',
    };
    expect(await service.readUserByEmail(target)).toEqual(result);
  });
});
