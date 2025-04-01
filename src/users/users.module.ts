import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { RolesPermissionsModule } from '../roles-permissions/roles-permissions.module';
import { UserFoldersModule } from '../user-folders/user-folders.module';
import User from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesPermissionsModule, UserFoldersModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
