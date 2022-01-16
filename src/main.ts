import {ClassSerializerInterceptor, Logger} from '@nestjs/common';
import {NestFactory, Reflector} from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import {AppModule} from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector))
    );
    const port = process.env.PORT || 3000;
    app.use(cookieParser());
    app.enableCors({credentials: true, origin: 'http://localhost:4200'});
    await app.listen(port);
    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
}
bootstrap();
