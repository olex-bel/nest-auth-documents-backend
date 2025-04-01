import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Folder from '../entities/folder.entity';
import UserFolder from '../entities/user.folder.entity';
import Document from '../entities/document.entity';
import { paginateResults } from 'src/utils/pagination';

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

    async getFolderDocuments(folderId: string, limit: number, currentCursor: string, query?: string) {
        const documentQuery = this.documentRepository.createQueryBuilder('d')
            .select(['d.id as id', 'd.title as title'])
            .where('d.folder_id = :folderId', { folderId });

        return paginateResults(
            documentQuery,
            limit,
            currentCursor,
            'id'
        );
    }

    async getAllFolders(limit: number, currentCursor: string, query?: string) {
        const folderQuery = this.folderRepository.createQueryBuilder('f')
            .select(['f.id as id', 'f.name as name']);
        
        if (query) {
            folderQuery.andWhere('f.name @@ plainto_tsquery(:query)', { query });
        }

        return paginateResults(
            folderQuery,
            limit,
            currentCursor,
            'id'
        );
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
}
