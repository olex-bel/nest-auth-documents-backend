import { Test, TestingModule } from '@nestjs/testing';
import { RolesPermissionsService } from './roles-permissions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserRole from '../entities/user.role.entity';
import UserFolder from '../entities/user.folder.entity';
import Role from '../entities/role.entity';

describe('RolesPermissionsService', () => {
    let service: RolesPermissionsService;

    const mockRoleRepository = {
        findOne: jest.fn(),
    };

    const mockUserRoleRepository = {
        find: jest.fn(),
    };

    const mockUserFolderRepository = {
        save: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RolesPermissionsService,
                {
                    provide: getRepositoryToken(UserRole),
                    useValue: mockUserRoleRepository,
                }, 
                {
                    provide: getRepositoryToken(UserFolder),
                    useValue: mockUserFolderRepository,
                },
                {
                    provide: getRepositoryToken(Role),
                    useValue: mockRoleRepository,
                }
            ],
        }).compile();

        service = module.get<RolesPermissionsService>(RolesPermissionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
