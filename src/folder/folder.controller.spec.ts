import { NotFoundException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FolderController } from './folder.controller';
import { RolesPermissionsService } from '../roles-permissions/roles-permissions.service';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { RenameFolderDto } from './dto/rename-folder.dto';
import { SetPermissionsDto } from './dto/set-permission.dto';
import { GetFoldersDto } from './dto/search-query.dto';

const mockRolesPermissionsService = {};
const mockFolderService = {
    createFolder: jest.fn(),
    deleteFolder: jest.fn(),
    renameFolder: jest.fn(),
    getFolder: jest.fn(),
    getFolders: jest.fn(),
    addPermission: jest.fn(),
    revokePermission: jest.fn(),
};

describe('FolderController', () => {
    let controller: FolderController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FolderController],
            providers: [
                {
                    provide: RolesPermissionsService,
                    useValue: mockRolesPermissionsService,
                },
                {
                    provide: FolderService,
                    useValue: mockFolderService,
                }
            ]
        }).compile();

        controller = module.get<FolderController>(FolderController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createFolder', () => {
        it('should create and return a folder', async () => {
            const createFolderDto: CreateFolderDto = { name: 'Test Folder' };
            const createdFolder = { id: '1', name: 'Test Folder' };
            mockFolderService.createFolder.mockResolvedValue(createdFolder);

            const result = await controller.createFolder(createFolderDto);

            expect(mockFolderService.createFolder).toHaveBeenCalledWith(createFolderDto.name);
            expect(result).toEqual(createdFolder);
        });
    });

    describe('deleteFolder', () => {
        it('should delete a folder and return the result', async () => {
            const folderId = '1';
            const deleteResult = { affected: 1 };
            mockFolderService.deleteFolder.mockResolvedValue(deleteResult);

            const result = await controller.deleteFolder(folderId);

            expect(mockFolderService.deleteFolder).toHaveBeenCalledWith(folderId);
            expect(result).toEqual(deleteResult);
        });

        it('should throw NotFoundException if folder not found', async () => {
            const folderId = '1';
            mockFolderService.deleteFolder.mockResolvedValue({ affected: 0 });

            await expect(controller.deleteFolder(folderId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('renameFolder', () => {
        it('should rename a folder and return the result', async () => {
            const folderId = '1';
            const renameFolderDto: RenameFolderDto = { name: 'New Name' };
            const updateResult = { affected: 1 };
            mockFolderService.renameFolder.mockResolvedValue(updateResult);

            const result = await controller.renameFolder(renameFolderDto, folderId);

            expect(mockFolderService.renameFolder).toHaveBeenCalledWith(folderId, renameFolderDto.name);
            expect(result).toEqual(updateResult);
        });

        it('should throw NotFoundException if folder not found', async () => {
            const folderId = '1';
            const renameFolderDto: RenameFolderDto = { name: 'New Name' };
            mockFolderService.renameFolder.mockResolvedValue({ affected: 0 });

            await expect(controller.renameFolder(renameFolderDto, folderId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getFolder', () => {
        it('should return a folder if it exists', async () => {
            const folderId = '1';
            const userId = '1';
            const folder = { id: folderId, name: 'Test Folder' };
            mockFolderService.getFolder.mockResolvedValue(folder);

            const result = await controller.getFolder(folderId, { user: { userId } });

            expect(mockFolderService.getFolder).toHaveBeenCalledWith(userId, folderId);
            expect(result).toEqual(folder);
        });

        it('should throw NotFoundException if folder not found', async () => {
            const folderId = '1';
            const userId = '1';
            mockFolderService.getFolder.mockResolvedValue(null);

            await expect(controller.getFolder(folderId, { user: { userId } })).rejects.toThrow(NotFoundException);
        });
    });

    describe('getFolders', () => {
        it('should return folders and new cursor', async () => {
            const userId = '1';
            const getFoldersDto: GetFoldersDto = { limit: 10, cursor: '5' };
            const folders = [
                { id: '6', name: 'Folder 6' },
                { id: '7', name: 'Folder 7' },
            ];
            const newCursor = '7';
            mockFolderService.getFolders.mockResolvedValue({ folders, newCursor });

            const result = await controller.getFolders(getFoldersDto, { user: { userId } });

            expect(mockFolderService.getFolders).toHaveBeenCalledWith(userId, getFoldersDto.limit, getFoldersDto.cursor);
            expect(result).toEqual({ folders, newCursor });
        });
    });

    describe('addPermission', () => {
        it('should add permission and return the result', async () => {
            const folderId = '1';
            const setPermissionsDto: SetPermissionsDto = { userId: '1', permissionId: 1 };
            const userFolder = { userId: '1', folderId: '1', permissionId: 1 };
            mockFolderService.addPermission.mockResolvedValue(userFolder);

            const result = await controller.addPermission(setPermissionsDto, folderId);

            expect(mockFolderService.addPermission).toHaveBeenCalledWith(setPermissionsDto.userId, folderId, setPermissionsDto.permissionId);
            expect(result).toEqual(userFolder);
        });

        it('should throw NotFoundException if folder or permission not found', async () => {
            const folderId = '1';
            const setPermissionsDto: SetPermissionsDto = { userId: '1', permissionId: 1 };
            mockFolderService.addPermission.mockRejectedValue(new NotFoundException());

            await expect(controller.addPermission(setPermissionsDto, folderId)).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException if permission already exists', async () => {
            const folderId = '1';
            const setPermissionsDto: SetPermissionsDto = { userId: '1', permissionId: 1 };
            mockFolderService.addPermission.mockRejectedValue(new ConflictException());

            await expect(controller.addPermission(setPermissionsDto, folderId)).rejects.toThrow(ConflictException);
        });
    });

    describe('removePermission', () => {
        it('should remove permission and return the result', async () => {
            const folderId = '1';
            const setPermissionsDto: SetPermissionsDto = { userId: '1', permissionId: 1 };
            const deleteResult = { affected: 1 };
            mockFolderService.revokePermission.mockResolvedValue(deleteResult);
    
            const result = await controller.removePermission(setPermissionsDto, folderId);
    
            expect(mockFolderService.revokePermission).toHaveBeenCalledWith(folderId, setPermissionsDto.userId, setPermissionsDto.permissionId);
            expect(result).toEqual(deleteResult);
        });
    
        it('should throw NotFoundException if no permission was revoked', async () => {
            const folderId = '1';
            const setPermissionsDto: SetPermissionsDto = { userId: '1', permissionId: 1 };
            mockFolderService.revokePermission.mockResolvedValue({ affected: 0 });
    
            await expect(controller.removePermission(setPermissionsDto, folderId)).rejects.toThrow(NotFoundException);
        });
    });
});
