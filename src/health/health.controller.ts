import { Controller } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../decorators/public.decorator';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
    ) {}

    @HealthCheck()
    @Public()
    check() {
        return this.health.check([
            () => this.db.pingCheck('database'),
        ]);
    }
}
