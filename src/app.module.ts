import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {AppController} from './app.controller';
import {envValidationSchema} from './config/env-validation-schema';
import {UsersModule} from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: envValidationSchema,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('DB_URI'),
            }),
            inject: [ConfigService],
        }),
        UsersModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
