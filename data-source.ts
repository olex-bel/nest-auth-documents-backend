
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
// import { $npmConfigName1734207543454 } from './migrations/1734207543454-$npm_config_name';
// import { Database1743854627598 } from './migrations/1743854627598-database';
import { FolderNameSearchVector1740685059070 } from './migrations/FolderNameSearchVector_1740685059070';
 
config();
 
const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  ssl: configService.get('POSTGRES_SSL') === 'true',
  entities: [__dirname + '/src/**/entities/*.entity{.ts,.js}'],
  migrations: [FolderNameSearchVector1740685059070],
});
