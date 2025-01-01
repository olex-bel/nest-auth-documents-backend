import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../src/auth/auth.module';
import { DataSource } from 'typeorm';
import { testDatasource } from './test-datasource';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AuthModule,
                TypeOrmModule.forRoot(testDatasource),
                ConfigModule.forRoot({
                    isGlobal: true,
                }),
            ],

        })    
        .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        dataSource = moduleFixture.get<DataSource>(DataSource);

        await dataSource.query('DELETE FROM users;');
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it('/auth/login should return 400 status code if body is invalid', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test',
                password: 'test',
            })
            .expect(400);
    });

    it('/auth/login should return 401 status code if user does not exist', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test@test.com',
                password: 'test',
            })
            .expect(401);
    });

    it('/auth/register should return 201 status code if user is created', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'test@test.com',
                password: 'test1234',
            }) 
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body).toHaveProperty('email');
            });
    });

    it('/auth/register should return 409 status code if user already exists', async () => {
        await dataSource.query('INSERT INTO users (email, password) VALUES ($1, $2)', ['test-exists@test.com', 'test1234']);

        return request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'test-exists@test.com',
                passport: 'test1234',
            })
            .expect(409);
    });
});
