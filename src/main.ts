import {ClassSerializerInterceptor, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {NestFactory, Reflector} from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import {AppModule} from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const frontendBaseUrl = configService.get('FRONTEND_BASE_URL');
    const globalPrefix = 'api';
    const port = process.env.PORT || 3000;

    app.setGlobalPrefix(globalPrefix);
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector))
    );
    app.use(cookieParser());
    app.enableCors({credentials: true, origin: frontendBaseUrl});
    await app.listen(port);

    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
}
bootstrap();
