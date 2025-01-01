import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

const MockHealthCheckService = {
    check: jest.fn(() => Promise.resolve({})),
};

const MockTypeOrmHealthIndicator = {
    pingCheck: jest.fn(() => Promise.resolve({})),
};

describe('HealthController', () => {
    let controller: HealthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
        })
            .useMocker((token) => {
                if (token === HealthCheckService) {
                    return MockHealthCheckService;
                }
                if (token === TypeOrmHealthIndicator) {
                    return MockTypeOrmHealthIndicator;
                }
            })
            .compile();

        controller = module.get<HealthController>(HealthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('check', () => {
        it('should return the result of the health check', async () => {
            await controller.check();
            expect(MockHealthCheckService.check).toHaveBeenCalledWith([
                expect.any(Function),
            ]);
        });
    });
});
