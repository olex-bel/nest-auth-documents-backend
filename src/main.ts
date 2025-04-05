import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
    }));

    const allowedOrigins = process.env.CORS_ORIGINS ?
        process.env.CORS_ORIGINS.split(',').map(item => item.trim()) : null;

    if (allowedOrigins) {
        console.log('CORS enabled for origins:', allowedOrigins);
        app.enableCors({
            origin: allowedOrigins,
        });
    }
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
