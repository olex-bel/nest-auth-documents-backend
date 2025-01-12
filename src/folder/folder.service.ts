import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Folder from '../entities/folder.entity';
import UserFolder from '../entities/user.folder.entity';
import Document from '../entities/document.entity';

@Injectable()
export class FolderService {
    constructor(
        @InjectRepository(Folder)
        private folderRepository: Repository<Folder>,
        @InjectRepository(UserFolder)
        private userFolderRepository: Repository<UserFolder>,
        @InjectRepository(Document)
        private documentRepository: Repository<Document>
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

    async getFolderDocuments(folderId: string) {
        return this.documentRepository.find({
            where: {
                folderId,
            }
        })
    }

    async getFolders(userId: string, limit: number, currentCursor: string) {
        const folders = await this.createFoldersQuery(userId, limit, currentCursor).getRawMany();
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

    private createFoldersQuery(userId: string, limit: number, currentCursor: string) {
        const folderQuery = this.userFolderRepository.createQueryBuilder('uf')
            .select(['f.id as id', 'f.name as name'])
            .leftJoin(Folder, 'f', 'f.id = uf.folderId')
            .where('uf.userId = :userId', { userId });

        if (currentCursor) {
            folderQuery.andWhere('f.id > :currentCursor', { currentCursor });
        }

        return folderQuery.orderBy('f.id', 'ASC').limit(limit);
    }

    private calculateNewCursor(folders, limit) {
        if (folders.length === 0) {
            return null;
        }

        return folders.length === limit ? folders[folders.length - 1].id : null;
    }
}
