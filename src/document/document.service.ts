import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import Document from 'src/entities/document.entity';
import * as crypto from 'crypto';

@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,
    ) {}

    async createDocument(folderId: string, userId: string, createDocumentDto: CreateDocumentDto): Promise<Document> {
        const { title, content } = createDocumentDto;
        const document = new Document();

        document.folderId = folderId;
        document.userId = userId;
        document.title = title;
        document.content = content;
        document.checksum = this.calculateChecksum(`${title}${content}`);

        return this.documentRepository.save(document);
    }

    async deleteDocument(documentId: string): Promise<DeleteResult> {
        return this.documentRepository.delete(documentId);
    }

    async updateDocument(documentId: string, updateDocumentDto: UpdateDocumentDto):  Promise<UpdateResult> {
        const { title, content, previousChecksum } = updateDocumentDto;
        const checksum = this.calculateChecksum(`${title}${content}`);

        return this.documentRepository.update({
            id: documentId,
            checksum: previousChecksum,
        }, {
            title: title,
            content: content,
            checksum,
        });
    }

    async getDocument(documentId: string): Promise<Document> {
        return this.documentRepository.findOne({
            where: {
                id: documentId,
            },
        });
    }

    private calculateChecksum(data: string): string {
        return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
    }
}
