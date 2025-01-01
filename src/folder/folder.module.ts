import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { RolesPermissionsModule } from '../roles-permissions/roles-permissions.module';
import Folder from '../entities/folder.entity';
import User from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder, User]),
    RolesPermissionsModule
  ],
  providers: [FolderService],
  controllers: [FolderController]
})
export class FolderModule {}
