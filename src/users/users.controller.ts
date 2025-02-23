import { Controller, Get, Param, Request, NotFoundException } from '@nestjs/common';
import { RolesPermissionsService } from '../roles-permissions/roles-permissions.service';

@Controller('users')
export class UsersController {
    constructor(private rolesPermissionsService: RolesPermissionsService) { }

    @Get('folder-premissions/:folderId')
    async getFolderPermissions(@Request() req, @Param('folderId') folderId: string) {
        const userFolderPermission = await this.rolesPermissionsService.getFolderPermission(req.user.userId, folderId);

        if (!userFolderPermission) {
            throw new NotFoundException();
        }

        return {permission:  userFolderPermission };
    }

    @Get('document-permissions/:documentId')
    async getDocumentPermissions(@Request() req, @Param('documentId') documentId: string) {
        const documentPermission = await this.rolesPermissionsService.getDocumentPermission(req.user.userId, documentId);

        if (!documentPermission) {
            throw new NotFoundException();
        }

        return { permission: documentPermission, isOwner: documentPermission.user_id === req.user.userId };
    }

    @Get('roles')
    async getRoles(@Request() req) {
        return await this.rolesPermissionsService.getRoles(req.user.userId);
    }
}
