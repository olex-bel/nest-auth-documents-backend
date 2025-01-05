import { Test, TestingModule } from '@nestjs/testing';
import { FolderService } from './folder.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Folder from '../entities/folder.entity';
import UserFolder from '../entities/user.folder.entity';

describe('FolderService', () => {
    let service: FolderService;

    const mockFolderRepository = {
        createQueryBuilder: jest.fn(() => mockFolderRepository),
        select: jest.fn(() => mockFolderRepository),
        leftJoin: jest.fn(() => mockFolderRepository),
        where: jest.fn(() => mockFolderRepository),
        andWhere: jest.fn(() => mockFolderRepository),
        getOne: jest.fn(),
        getRawMany: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockUserFolderRepository = {
        save: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FolderService,
                {
                    provide: getRepositoryToken(Folder),
                    useValue: mockFolderRepository,
                },
                {
                    provide: getRepositoryToken(UserFolder),
                    useValue: mockUserFolderRepository,
                }
            ],
        }).compile();

        service = module.get<FolderService>(FolderService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createFolder', () => {
        it('should create and save new folder entity', async () => {
            const folderName = 'Test Folder';
            mockFolderRepository.save.mockResolvedValue({ id: '1', name: folderName });

            const result = await service.createFolder(folderName);

            expect(mockFolderRepository.save).toHaveBeenCalledWith({ name: folderName });
            expect(result).toEqual({ id: '1', name: folderName });
        });
    });

    describe("deleteFolder", () => {
        it('should call delete method', async () => {
            mockFolderRepository.delete.mockResolvedValue({ affected: 1 });
            const result = await service.deleteFolder('1');
            expect(result).toEqual({ affected: 1 });
        });
    });

    describe('renameFolder', () => {
        it('should call update method', async () => {
            mockFolderRepository.update.mockResolvedValue({ affected: 1 });
            const result = await service.renameFolder('1', 'new name');
            expect(result).toEqual({ affected: 1 });
        })
    });

    describe('getFolder', () => {
        it('should return folder', async () => {
            const folderId = '1';
            const userId = '1';
            const folder = { id: folderId, name: 'Test Folder', userFolders: [{ userId }] };

            mockFolderRepository.createQueryBuilder = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(folder),
            });
    
            const result = await service.getFolder(userId, folderId);
    
            expect(result).toEqual(folder);
        });
    });

    describe('getFolders', () => {
        it('should return folders and new cursor', async () => {
            const userId = '1';
            const limit = 10;
            const currentCursor = null;
            const folders = [
                { id: '1', name: 'Folder 1' },
                { id: '2', name: 'Folder 2' },
                { id: '3', name: 'Folder 3' },
                { id: '4', name: 'Folder 4' },
                { id: '5', name: 'Folder 5' },
                { id: '6', name: 'Folder 6' },
                { id: '7', name: 'Folder 7' },
                { id: '8', name: 'Folder 8' },
                { id: '9', name: 'Folder 9' },
                { id: '10', name: 'Folder 10' },
            ];
    
            mockFolderRepository.createQueryBuilder = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue(folders),
            });
    
            const result = await service.getFolders(userId, limit, currentCursor);
    
            expect(result).toEqual({
                folders,
                newCursor: folders[folders.length - 1].id,
            });
        });
    
        it('should return folders and null cursor if less than limit folders are returned', async () => {
            const userId = '1';
            const limit = 10;
            const currentCursor = '5';
            const folders = [
                { id: '6', name: 'Folder 6' },
                { id: '7', name: 'Folder 7' },
            ];
    
            mockFolderRepository.createQueryBuilder = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue(folders),
            });
    
            const result = await service.getFolders(userId, limit, currentCursor);
    
            expect(result).toEqual({
                folders,
                newCursor: null,
            });
        });
    });

    describe('addPermission', () => {
        it('should add permission successfully', async () => {
            const userId = '1';
            const folderId = '1';
            const permissionId = 1;
            const userFolder = { userId, folderId, permissionId };
    
            mockUserFolderRepository.save.mockResolvedValue(userFolder);
    
            const result = await service.addPermission(userId, folderId, permissionId);
    
            expect(mockUserFolderRepository.save).toHaveBeenCalledWith(userFolder);
            expect(result).toEqual(userFolder);
        });
    });

    describe('revokePermission', () => {
        it('should revoke permission successfully', async () => {
            const userId = '1';
            const folderId = '1';
            const permissionId = 1;
    
            mockUserFolderRepository.delete.mockResolvedValue({ affected: 1 });
    
            const result = await service.revokePermission(folderId, userId, permissionId);
    
            expect(mockUserFolderRepository.delete).toHaveBeenCalledWith({ folderId, userId, permissionId });
            expect(result).toEqual({ affected: 1 });
        });
    })
});
