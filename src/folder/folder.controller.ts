import { Controller, Post, Patch, Delete, Get, UseGuards, Body, Request, Param, Query, NotFoundException, ConflictException } from '@nestjs/common';
import { FolderService } from './folder.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionGuard } from '../roles-permissions/guard/permission-guard';
import { RequirePermissions } from '../decorators/permission.decorator';
import { CreateFolderDto } from './dto/create-folder.dto';
import { RenameFolderDto } from './dto/rename-folder.dto';
import { GetFoldersDto } from './dto/get-folders.dto';
import { SetPermissionsDto } from './dto/set-permission.dto';
import { RevokePermissionDto } from './dto/revoke-permission.dto';

@Controller('folder')
export class FolderController {
    constructor(private readonly folderService: FolderService) { }

    @Post()
    @RequirePermissions('create:folder')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async createFolder(@Body() createFolderDto: CreateFolderDto) {
        return this.folderService.createFolder(createFolderDto.name);
    }

    @Delete(':id')
    @RequirePermissions('delete:folder')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async deleteFolder(@Param('id') id: string) {
        const deleted = await this.folderService.deleteFolder(id);

        if (deleted.affected === 0) {
            throw new NotFoundException('Folder not found.');
        }

        return deleted;
    }

    @Patch('rename/:id')
    @RequirePermissions('rename:folder')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async renameFolder(@Body() renameFolderDto: RenameFolderDto, @Param('id') id: string) {
        const updated = await this.folderService.renameFolder(id, renameFolderDto.name);

        if (updated.affected == 0) {
            throw new NotFoundException('Folder not found.');
        }

        return updated;
    }

    @Get(':id')
    @RequirePermissions('read:folderDocuments')
    @UseGuards(JwtAuthGuard)
    async getFolderDocuments(@Param('id') id: string) {
        return this.folderService.getFolderDocuments(id);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getFolders(@Query() getFoldersDto: GetFoldersDto, @Request() req) {
        const { limit, cursor } = getFoldersDto;
        return this.folderService.getFolders(req.user.userId, limit, cursor);
    }

    @Post(':folderId/permissions')
    @RequirePermissions('manage:permissions')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async setPermission(@Body() setPermissionsDto: SetPermissionsDto, @Param('folderId') folderId: string) {
        const { userId, permissionId } = setPermissionsDto;

        try {
            return await this.folderService.setPermission(userId, folderId, permissionId);
        } catch (error) {
            if (error.code === '23503') {
                if (error.detail.includes('folder_id')) {
                    throw new NotFoundException(`Folder with ID ${folderId} not found`);
                } else if (error.detail.includes('permission_id')) {
                    throw new NotFoundException(`Permission with ID ${permissionId} not found`);
                } else if (error.detail.includes('user_id')) {
                    throw new NotFoundException(`User with ID ${userId} not found`);
                }
            } else if (error.code === '23505') {
                throw new ConflictException('Permission already granted.');
            }

            throw error;
        }
    }

    @Delete(':folderId/permissions')
    @RequirePermissions('manage:permissions')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async removePermission(@Body() revokePermissionDto: RevokePermissionDto, @Param('folderId') folderId: string) {
        const { userId } = revokePermissionDto;
        const deleted = await this.folderService.revokePermission(folderId, userId);

        if (deleted.affected === 0) {
            throw new NotFoundException('Permission not found.');
        }

        return deleted;
    }
}
