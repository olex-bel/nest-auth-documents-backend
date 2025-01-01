import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import e from 'express';

const mockUsersService = {
    findOneByEmail: jest.fn(),
    resetFailedLoginAttempts: jest.fn(),
    incrementFailedLoginAttempts: jest.fn(),
    create: jest.fn(),
};

const mockJwtService = {
    sign: jest.fn(),
};

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService],
        })
        .useMocker((token) => {
            if (token === UsersService) {
                return mockUsersService;
            } else if (token === JwtService) {
                return mockJwtService;
            }
        })
        .compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return a user', async () => {
            const user = { id:
                '123',
                email: 'test@test.com',
                password: bcrypt.hashSync('password', 10),
                enabled: true,
            };

            mockUsersService.findOneByEmail.mockReturnValue(user);

            expect(await service.validateUser('test@test.com', 'password')).toEqual({
                id: '123',
                email: 'test@test.com',
                enabled: true,
            });
            expect(mockUsersService.resetFailedLoginAttempts).toHaveBeenCalledWith(user);
        });

        it('should return null if user is not found', async () => {
            mockUsersService.findOneByEmail.mockReturnValue(null);

            expect(await service.validateUser('test@test.com', 'password')).toBeNull();
        });

        it('should throw an error if user is disabled', async () => {
            const user = { id: '123', email: 'test@test.com', password: 'password', enabled: false };

            mockUsersService.findOneByEmail.mockReturnValue(user);

            expect(async () => {
                await service.validateUser('test@test.com', 'password');
            }).rejects.toThrow();
        });

        it('should return null if password is incorrect', async () => {
            const user = { id: '123',
                email: 'test@test.com',
                password: bcrypt.hashSync('password', 10),
                enabled: true,
            };

            mockUsersService.findOneByEmail.mockReturnValue(user);
            expect(await service.validateUser('test@test.com', 'wrongpassword')).toBeNull();
            expect(mockUsersService.incrementFailedLoginAttempts).toHaveBeenCalledWith(user);
        });
    });

    describe('login', () => {
        it('should return an access token', async () => {
            mockJwtService.sign.mockReturnValue('token');

            expect(await service.login({ id: '123' })).toEqual({ access_token: 'token' });
        });
    });

    describe('register', () => {
        it('should create a user', async () => {
            const createUserDto = {
                email: 'test@test.com',
                password: 'password',
            };

            mockUsersService.findOneByEmail.mockReturnValue(null);
            mockUsersService.create.mockReturnValue({ id: '123', ...createUserDto });
            expect(await service.register(createUserDto)).toEqual({ id: '123', ...createUserDto });
        });

        it('should throw an error if user already exists', async () => {
            const createUserDto = {
                email: 'test@test.com',
                password: 'password',
            };

            mockUsersService.findOneByEmail.mockReturnValue({ id: '123', ...createUserDto });
            expect(async () => {
                await service.register(createUserDto);
            }).rejects.toThrow();
        });
    });
});
