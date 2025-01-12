import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { RolesPermissionsModule } from '../roles-permissions/roles-permissions.module';
import Folder from '../entities/folder.entity';
import UserFolder from '../entities/user.folder.entity';
import Document from '../entities/document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder, UserFolder, Document]),
    RolesPermissionsModule
  ],
  providers: [FolderService],
  controllers: [FolderController]
})
export class FolderModule {}
