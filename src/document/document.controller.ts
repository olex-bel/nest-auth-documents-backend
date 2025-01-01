import { Controller, UseGuards, Post, Delete, Patch, Get, Request } from '@nestjs/common';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionGuard } from '../auth/guard/permission-guard';
import { RequirePermissions } from '../decorators/permission.decorator';

@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @Post(':folderId')
    @RequirePermissions('create:document')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async createDocument(@Request() req) {
        return req.user;
    }

    @Delete(':folderId/:id')
    @RequirePermissions('delete:document')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async deleteDocument(@Request() req) {
        return req.user;
    }

    @Patch(':folderId/:id')
    @RequirePermissions('update:document')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async updateDocument(@Request() req) {
        return req.user;
    }

    @Get(':folderId/:id')
    @RequirePermissions('read:document')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async getDocument(@Request() req) {
        return req.user;
    }

    @Get(':folderId')
    @RequirePermissions('read:document')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PermissionGuard)
    async getDocuments(@Request() req) {
        return req.user;
    }
}
