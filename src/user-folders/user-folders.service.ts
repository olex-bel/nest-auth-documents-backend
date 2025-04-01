import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserFolder from 'src/entities/user.folder.entity';
import Folder from 'src/entities/folder.entity';
import { paginateResults } from 'src/utils/pagination';

@Injectable()
export class UserFoldersService {
    constructor(
        @InjectRepository(UserFolder) private userFolderRepository: Repository<UserFolder>,
        @InjectRepository(Folder) private folderRepository: Repository<Folder>
    ) {}

    async getFolders(userId: string, limit: number, currentCursor: string, query?: string) {
        const folderQuery = this.userFolderRepository.createQueryBuilder('uf')
            .select(['f.id as id', 'f.name as name', 'uf.permission_id as "permissionId"'])
            .leftJoin(Folder, 'f', 'f.id = uf.folderId')
            .where('uf.userId = :userId', { userId });
        
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

    async getUserNoAssignedFolders(userId: string, limit: number, currentCursor: string, query?: string) {
        const folderQuery = this.folderRepository.createQueryBuilder('f')
            .select(['f.id as id', 'f.name as name'])
            .leftJoin(UserFolder, 'uf', 'uf.folderId = f.id AND uf.userId = :userId', { userId })
            .where('uf.folderId IS NULL');
    
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
}
