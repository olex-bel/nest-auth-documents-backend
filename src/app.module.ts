import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { FolderModule } from './folder/folder.module';
import { RolesPermissionsModule } from './roles-permissions/roles-permissions.module';
import { DocumentModule } from './document/document.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('POSTGRES_HOST'),
                port: +configService.get('POSTGRES_PORT'),
                username: configService.get('POSTGRES_USER'),
                password: configService.get('POSTGRES_PASSWORD'),
                database: configService.get('POSTGRES_DB'),
                ssl: configService.get('POSTGRES_SSL') === 'true',
                entities: [__dirname + '/../**/*.entity.js'],
                synchronize: configService.get('TYPEORM_SYNCHRONIZE') === 'true',
                logging: configService.get('TYPEORM_LOGGING'),
            }),
            inject: [ConfigService],
        }),
        TerminusModule,
        AuthModule,
        UsersModule,
        FolderModule,
        RolesPermissionsModule,
        DocumentModule,
    ],
    controllers: [HealthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule { }
