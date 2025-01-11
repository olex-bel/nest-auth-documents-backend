import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Folder from '../entities/folder.entity';
import UserFolder from '../entities/user.folder.entity';

@Injectable()
export class FolderService {
    constructor(
        @InjectRepository(Folder)
        private folderRepository: Repository<Folder>,
        @InjectRepository(UserFolder)
        private userFolderRepository: Repository<UserFolder>
    ) {}
    
    async createFolder(folderName: string) {
        const folder = new Folder();
        folder.name = folderName;
        return this.folderRepository.save(folder);
    }

    async deleteFolder(folderId: string) {
        return this.folderRepository.delete(folderId);
    }

    async renameFolder(folderId: string, folderName: string) {
        return this.folderRepository.update(folderId, { name: folderName });
    }

    async getFolder(userId: string, folderId: string) {
        return this.folderRepository.createQueryBuilder('folder')
              .select(['folder.id as id', 'folder.name as name'])
              .leftJoin(UserFolder, 'userFolder', 'folder.id = userFolder.folderId')
              .where('folder.id = :folderId', { folderId })
              .andWhere('userFolder.userId = :userId', { userId })
              .getOne();
    }

    async getFolders(userId: string, limit: number, currentCursor: string) {
        const folders = await this.createFolderQuery(userId, limit, currentCursor).getRawMany();
        const newCursor = this.calculateNewCursor(folders, limit);
        
        return { folders, newCursor };
    }

    async setPermission(userId: string, folderId: string, permissionId: number) {
        return this.userFolderRepository.upsert({
            userId,
            folderId,
            permissionId,
        }, ["userId", "folderId"]);
    }

    async revokePermission(folderId: string, userId: string) {
        return this.userFolderRepository.delete({ folderId, userId });
    }

    private createFolderQuery(userId: string, limit: number, currentCursor: string) {
        const folderQuery = this.folderRepository.createQueryBuilder('folder')
            .select(['folder.id as id', 'folder.name as name'])
            .leftJoin(UserFolder, 'userFolder', 'folder.id = userFolder.folderId')
            .where('userFolder.userId = :userId', { userId });

        if (currentCursor) {
            folderQuery.andWhere('folder.id > :currentCursor', { currentCursor });
        }

        return folderQuery.orderBy('folder.id', 'ASC').limit(limit);
    }

    private calculateNewCursor(folders, limit) {
        if (folders.length === 0) {
            return null;
        }

        return folders.length === limit ? folders[folders.length - 1].id : null;
    }
}
