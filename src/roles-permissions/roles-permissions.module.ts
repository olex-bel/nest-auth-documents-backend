import { Module } from '@nestjs/common';
import { RolesPermissionsService } from './roles-permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserRole from '../entities/user.role.entity';
import UserFolder from '../entities/user.folder.entity';
import Folder from '../entities/folder.entity';
import Document from '../entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, UserRole, UserFolder, Document])],
  providers: [RolesPermissionsService],
  exports: [RolesPermissionsService],
})
export class RolesPermissionsModule {}
