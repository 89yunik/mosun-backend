import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { TeamsService } from './teams.service';

const teams = [{ name: 'table tennis' }, { name: 'borad game' }];

const mockTeamsRepository = {
  create: jest.fn((target) => target),
  save: jest.fn((target) => {
    teams.push(target);
    return target;
  }),
};

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamsRepository,
        },
        // {
        //   provide: getRepositoryToken(TeamUser),
        //   useValue: mockTeamsRepository,
        // },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.createTeamOfUser).toBeDefined();
  });

  it('should return a created team', async () => {
    const validTeam = { name: 'newTeam' };
    expect(await service.createTeamOfUser(validTeam, 1)).toEqual(validTeam);
  });
});
