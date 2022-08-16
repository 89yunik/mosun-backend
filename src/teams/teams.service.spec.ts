import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamsService],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

// const groups = [
//   {
//     name: 'table tennis',
//   },
//   {
//     name: 'board game',
//   },
// ];

// const mockGroupsRepository = {
//   create: jest.fn((target) => target),
//   save: jest.fn((target) => {
//     groups.push(target);
//     return target;
//   }),
//   // findOneBy: jest.fn((target) => {
//   //   if (target.email) {
//   //     return groups.find((user) => user.email === target.email);
//   //   } else if (target.refresh_token) {
//   //     return groups.find((user) => user.refresh_token === target.refresh_token);
//   //   }
//   // }),
//   // update: jest.fn((target, update) => {
//   //   const user = groups.find((user) => user.email === target.email);
//   //   return { ...user, ...update };
//   // }),
// };

// describe('GroupsService', () => {
//   let service: GroupsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         GroupsService,
//         {
//           provide: getRepositoryToken(Group),
//           useValue: mockGroupsRepository,
//         },
//         {
//           provide: getRepositoryToken(GroupUser),
//           useValue: mockGroupsRepository,
//         },
//       ],
//     }).compile();

//     service = module.get<GroupsService>(GroupsService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//     expect(service.createGroupOfUser).toBeDefined();
//   });

//   it('should return a created group', async () => {
//     const validGroup = { name: 'newGroup' };
//     expect(await service.createGroupOfUser(validGroup, 1)).toEqual(validGroup);
//   });
// });
