import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;

    const mockAuthService = {
        login: jest.fn(),
        register: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
        })
            .useMocker((token) => {
                if (token === AuthService) {
                    return mockAuthService;
                }
            })
            .compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        it('should return a token', async () => {
            mockAuthService.login.mockReturnValue({ access_token: 'token' });
            expect(await controller.login({})).toEqual({
                access_token: 'token',
            });
        });
    });

    describe('register', () => {
        it('should return a user', async () => {
            mockAuthService.register.mockReturnValue({
                id: '123',
                email: 'test@test.com',
                enabled: true,
            });

            expect(
                await controller.register({
                    email: 'test@test.com',
                    password: 'password',
                })
            ).toEqual({
                id: '123',
                email: 'test@test.com',
                enabled: true,
            });
        });

        it('should throw a conflict exception', async () => {
            mockAuthService.register.mockRejectedValue(new Error('User already exists'));

            await expect(
                controller.register({
                    email: 'test@test.com',
                    password: 'password',
                })
            ).rejects.toThrow('User already exists');
        });
    });
});
