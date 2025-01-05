import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Role from '../entities/role.entity';
import UserRole from '../entities/user.role.entity';
import UserFolder from '../entities/user.folder.entity';

const ADMIN_ROLE_ID = 1;
const PERMISSION_EDITOR =  1;
const PERMISSION_VIEWER = 2;
const PERMISSION_CONTRIBUTOR = 3;

@Injectable()
export class RolesPermissionsService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
        @InjectRepository(UserFolder)
        private userFolderRepository: Repository<UserFolder>,
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
}
