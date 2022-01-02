import {INestApplication} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {envValidationSchema} from '../src/config/env-validation-schema';
import {UsersModule} from '../src/users/users.module';

describe('Users', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    validationSchema: envValidationSchema,
                }),
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: ConfigService) => ({
                        uri: configService.get('DB_TEST_URI'),
                    }),
                    inject: [ConfigService],
                }),
                UsersModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/POST new user`, () => {
        return request(app.getHttpServer())
            .post('/users')
            .send({email: 'hello@mail.com', password: 'secret'})
            .expect(201);
    });

    afterAll(async () => {
        await app.close();
    });
});
