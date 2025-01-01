import { Module } from '@nestjs/common';
import { RolesPermissionsService } from './roles-permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Role from '../entities/role.entity';
import UserRole from 'src/entities/user.role.entity';
import UserFolder from 'src/entities/user.folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole, UserFolder])],
  providers: [RolesPermissionsService],
  exports: [RolesPermissionsService],
})
export class RolesPermissionsModule {}
