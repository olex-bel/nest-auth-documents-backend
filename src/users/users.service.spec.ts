import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import e from 'express';

const mockUsersRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
};

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
        })
            .useMocker((token) => {
                if (token === 'UserRepository') {
                    return mockUsersRepository;
                }
            })
            .compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOneByEmail', () => {
        it('should return a user', async () => {
            const email = 'test@test.com';
            const user = { email };
            mockUsersRepository.findOneBy.mockReturnValue(user);
            expect(await service.findOneByEmail(email)).toBe(user);
        });

        it('should return null if no user is found', async () => {
            const email = 'test-nofound@test.com';
            mockUsersRepository.findOneBy.mockReturnValue(null);
            expect(await service.findOneByEmail(email)).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a user', async () => {
            const createUserDto = {
                email: 'test@test.com',
                password: 'password',
            };
            const user = { ...createUserDto, enabled: true };
            mockUsersRepository.save.mockReturnValue(user);
            expect(await service.create(createUserDto)).toBe(user);
        });
    });

    describe('resetFailedLoginAttempts', () => {
        it('should reset failed login attempts', async () => {
            const user = {
                id: '1',
                enabled: true,
                password: 'password',
                email: 'test@test.com',
                failedLoginAttempts: 3,
            };
            await service.resetFailedLoginAttempts(user);
            expect(user.failedLoginAttempts).toBe(0);
        });
    });
});
