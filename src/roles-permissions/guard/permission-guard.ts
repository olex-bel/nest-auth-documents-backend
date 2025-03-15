import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesPermissionsService } from '../roles-permissions.service';
import type { PublicUser } from '../../auth/strategy/jwt.strategy';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private rolesPermissionsService: RolesPermissionsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission = this.reflector.get<string>('permission', context.getHandler());
        if (!requiredPermission) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user as PublicUser;

        switch (requiredPermission) {            
            case 'create:folder':
                return this.rolesPermissionsService.isAdmin(user.userId);
            case 'delete:folder':
                return this.rolesPermissionsService.isAdmin(user.userId);
            case 'rename:folder':
                return this.rolesPermissionsService.isAdmin(user.userId);
            case 'manage:permissions':
                return this.rolesPermissionsService.isAdmin(user.userId);
            case 'manage:users':
                return this.rolesPermissionsService.isAdmin(user.userId);
            case 'read:allFolder':
                return this.rolesPermissionsService.isAdmin(user.userId);
            case 'create:document':
                return this.rolesPermissionsService.canCreateDocument(user.userId, request.params.folderId);
            case 'delete:document':
                return this.rolesPermissionsService.canModifyDocument(user.userId, request.params.id);
            case 'update:document':
                return this.rolesPermissionsService.canModifyDocument(user.userId, request.params.id);
            case 'read:document':
                return this.rolesPermissionsService.canReadDocument(user.userId, request.params.id);
            case 'read:folderDocuments':
                return this.rolesPermissionsService.canReadFolderDocuments(user.userId, request.params.id)
            default:
                return false;
        }
    }
}