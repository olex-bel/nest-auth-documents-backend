import { Controller, Post, Patch, Delete, Get, UseGuards, Body, Request, Param } from '@nestjs/common';
import { FolderService } from './folder.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionGuard } from '../auth/guard/permission-guard';
import { RequirePermissions } from '../decorators/permission.decorator';
import { CreateFolderDto } from './dto/create-folder.dto';

@Controller('folder')
export class FolderController {
    constructor(private readonly folderService: FolderService) {}

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
        return this.folderService.deleteFolder(id);
    }

    @Patch('rename/:id')
    @RequirePermissions('rename:folder')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async renameFolder(@Request() req) {
        return req.user;
    }

    @Get(':id')
    @RequirePermissions('read:folder')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async getFolder(@Request() req) {
        return req.user;
    }

    @Get()
    @RequirePermissions('read:folder')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async getFolders(@Request() req) {
        return req.user;
    }

    @Post(':folderId/permissions')
    @RequirePermissions('manage:permissions')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async addPermission(@Request() req) {
        return req.user;
    }

    @Delete(':folderId/permissions')
    @RequirePermissions('manage:permissions')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async removePermission(@Request() req) {
        return req.user;
    }
}
