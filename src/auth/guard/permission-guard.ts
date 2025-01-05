import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesPermissionsService } from '../../roles-permissions/roles-permissions.service';
import type { PublicUser } from '../strategy/jwt.strategy';

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
            default:
                return false;
        }
    }
}