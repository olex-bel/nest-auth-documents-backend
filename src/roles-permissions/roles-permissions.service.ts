import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import UserRole from '../entities/user.role.entity';
import UserFolder from '../entities/user.folder.entity';
import Folder from '../entities/folder.entity';
import Document from '../entities/document.entity';

const ADMIN_ROLE_ID = 1;

export enum Permission {
    SUPERVISE = 1,
    VIEW = 2,
    CONTRIBUT = 3,
}

type UserFolderPermissionType = {
    id: string;
    permission_id: Permission;
}

type DocumentPermissionType = {
    id: string;
    user_id: string;
    permission_id: Permission;
}

@Injectable()
export class RolesPermissionsService {
    constructor(
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
        @InjectRepository(Folder)
        private folderRepository: Repository<Folder>,
        @InjectRepository(Document)
        private documentRepository: Repository<Document>
    ) {}

    async isAdmin(userId: string): Promise<boolean> {
        const userRole = await this.userRoleRepository.find({
            where: { 
                userId,
                roleId: ADMIN_ROLE_ID,
            },
        });

        return userRole.length > 0;
    }

    async canCreateDocument(userId: string, folderId: string): Promise<boolean> {
        const userFolderPermission = await this.getFolderPermission(userId, folderId);
        
        if (!userFolderPermission) {
            throw new NotFoundException(`Folder ${folderId} not found.`);
        }

        return [Permission.CONTRIBUT, Permission.SUPERVISE].includes(userFolderPermission.permission_id);
    }

    async canModifyDocument(userId: string, documentId: string): Promise<boolean> {
        const documentPermission = await this.getDocumentPermission(userId, documentId);
        
        if (!documentPermission) {
            throw new NotFoundException(`Document ${documentId} not found.`);
        }

        const userPermissionId = documentPermission.permission_id;

        if (userPermissionId === Permission.CONTRIBUT && documentPermission.user_id === userId) {
            return true;
        }

        return userPermissionId === Permission.SUPERVISE;
    }

    async canReadDocument(userId: string, documentId: string) {
        const documentPermission = await this.getDocumentPermission(userId, documentId);
        
        if (!documentPermission) {
            throw new NotFoundException(`Document ${documentId} not found.`);
        }

        return [Permission.VIEW, Permission.CONTRIBUT, Permission.SUPERVISE].includes(documentPermission.permission_id);
    }

    private async getFolderPermission(userId: string, folderId: string): Promise<UserFolderPermissionType | null> {
        return this.folderRepository.createQueryBuilder('f')
            .select(['id', 'permission_id'])
            .leftJoin('user_folder', 'uf', 'f.id = uf.folder_id')
            .where('uf.user_id = :userId', { userId })
            .andWhere('uf.id = :folderId', { folderId })
            .getRawOne<UserFolderPermissionType>();
    }

    private async getDocumentPermission(userId: string, documentId: string): Promise<DocumentPermissionType | null> {
        return this.documentRepository.createQueryBuilder('d')
            .select(['id', 'user_id', 'permission_id'])
            .leftJoin('user_folder', 'uf', 'f.id = uf.folder_id')
            .where('uf.user_id = :userId', { userId })
            .andWhere('d.id = :documentId', { documentId })
            .getRawOne<DocumentPermissionType>();
    }
}
