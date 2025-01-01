import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Folder from '../entities/folder.entity';

@Injectable()
export class FolderService {
    constructor(
        @InjectRepository(Folder)
        private folderRepository: Repository<Folder>,
    ) {}
    
    async createFolder(folderName: string) {
        const folder = new Folder();
        folder.name = folderName;
        return this.folderRepository.save(folder);
    }

    async deleteFolder(folderId: string) {
        return this.folderRepository.delete(folderId);
    }
}
