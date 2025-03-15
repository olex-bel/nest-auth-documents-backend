import { Controller, UseGuards, Post, Delete, Patch, Get, Request, Body, Param, NotFoundException } from '@nestjs/common';
import { DocumentService } from './document.service';
import { PermissionGuard } from '../roles-permissions/guard/permission-guard';
import { RequirePermissions } from '../decorators/permission.decorator';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @Post(':folderId')
    @RequirePermissions('create:document')
    @UseGuards(PermissionGuard)
    async createDocument(@Request() req, @Param('folderId') folderId: string, @Body() createDocumentDto: CreateDocumentDto) {
        const userId = req.user.userId;

        try {
            return await this.documentService.createDocument(folderId, userId, createDocumentDto);
        } catch (error) {
            if (error.code === '23503') {
                if (error.detail.includes('folder_id')) {
                    throw new NotFoundException(`Folder with ID ${folderId} not found`);
                } else if (error.detail.includes('user_id')) {
                    throw new NotFoundException(`User with ID ${userId} not found`);
                }
            }

            throw error;
        }
    }

    @Delete(':id')
    @RequirePermissions('delete:document')
    @UseGuards(PermissionGuard)
    async deleteDocument(@Param('id') documentId) {
        const deleted = await this.documentService.deleteDocument(documentId);

        if (deleted.affected === 0) {
            throw new NotFoundException('Document not found.');
        }

        return deleted;
    }

    @Patch(':id')
    @RequirePermissions('update:document')
    @UseGuards(PermissionGuard)
    async updateDocument(@Param('id') documentId, @Body() updateDocumentDto: UpdateDocumentDto) {
        const updated = await this.documentService.updateDocument(documentId, updateDocumentDto);

        if (updated.affected === 0) {
            throw new NotFoundException('Document not found.');
        }

        return updated;
    }

    @Get(':id')
    @RequirePermissions('read:document')
    @UseGuards(PermissionGuard)
    async getDocument(@Param('id') documentId) {
        return this.documentService.getDocument(documentId);
    }
}
