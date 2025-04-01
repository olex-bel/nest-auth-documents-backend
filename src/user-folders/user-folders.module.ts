import { Module } from '@nestjs/common';
import { UserFoldersService } from './user-folders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesPermissionsModule } from 'src/roles-permissions/roles-permissions.module';
import Folder from '../entities/folder.entity';
import UserFolder from '../entities/user.folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, UserFolder]), RolesPermissionsModule],
  providers: [UserFoldersService],
  exports: [UserFoldersService],
})
export class UserFoldersModule {}
