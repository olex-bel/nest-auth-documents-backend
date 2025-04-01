import { Test, TestingModule } from '@nestjs/testing';
import { UserFoldersService } from './user-folders.service';

describe('UserFoldersService', () => {
  let service: UserFoldersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFoldersService],
    }).compile();

    service = module.get<UserFoldersService>(UserFoldersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
