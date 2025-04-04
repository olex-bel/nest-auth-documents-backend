import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import User from '../src/entities/user.entity';

config();

const configService = new ConfigService();

export const testDatasource: PostgresConnectionOptions = {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    ssl: false,
    entities: [User],
    synchronize: true,
};