import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesPermissionsModule } from '../roles-permissions/roles-permissions.module';
import Document from '../entities/document.entity';
import User from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, User]),
    RolesPermissionsModule
  ],
  controllers: [DocumentController],
  providers: [DocumentService]
})
export class DocumentModule {}
