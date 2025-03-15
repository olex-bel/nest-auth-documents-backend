import { Controller, Get, Param, Request, NotFoundException, UseGuards, Query } from '@nestjs/common';
import { RolesPermissionsService } from '../roles-permissions/roles-permissions.service';
import { UsersService } from './users.service';
import { RequirePermissions } from '../decorators/permission.decorator';
import { PermissionGuard } from '../roles-permissions/guard/permission-guard';
import { GetUsersDto } from './dto/get-users.dto';

@Controller('users')
export class UsersController {
    constructor(
        private rolesPermissionsService: RolesPermissionsService,
        private usersService: UsersService
    ) { }

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

    @Get('all')
    @RequirePermissions('manage:users')
    @UseGuards(PermissionGuard)
    async getAllUsers(@Query() getUsersDto: GetUsersDto) {
        return await this.usersService.getAllUsers(getUsersDto.limit, getUsersDto.cursor);
    }

    @Get(':id')
    @RequirePermissions('manage:users')
    @UseGuards(PermissionGuard)
    async getUser(@Param('id') id: string) {
        return await this.usersService.getUserById(id);
    }

}
