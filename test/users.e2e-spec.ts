import {ClassSerializerInterceptor, INestApplication} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Reflector} from '@nestjs/core';
import {getConnectionToken, MongooseModule} from '@nestjs/mongoose';
import {Test} from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import {Connection} from 'mongoose';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import {AuthModule} from '../src/auth/auth.module';
import {envValidationSchema} from '../src/config/env-validation-schema';
import {UsersModule} from '../src/users/users.module';

describe('Users', () => {
    let app: INestApplication;
    let newUserId;

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
                AuthModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        const configService = app.get(ConfigService);
        const frontendBaseUrl = configService.get('FRONTEND_BASE_URL');

        app.useGlobalInterceptors(
            new ClassSerializerInterceptor(app.get(Reflector))
        );
        app.use(cookieParser());
        app.enableCors({credentials: true, origin: frontendBaseUrl});
        await app.init();
    });

    describe('/POST Users', () => {
        describe('when new user is posted', () => {
            it(`should create a new user and the returned id property should be without _`, () => {
                return request(app.getHttpServer())
                    .post('/auth/register')
                    .send({email: 'hello@mail.com', password: 'secret1234'})
                    .expect(201)
                    .then(data => {
                        const body = data.body;
                        newUserId = body.id;
                        expect(body).not.toHaveProperty('_id');
                    });
            });
        });

        describe('when existing user is posted', () => {
            it(`should throw an exception`, () => {
                return request(app.getHttpServer())
                    .post('/auth/register')
                    .send({email: 'hello@mail.com', password: 'secret'})
                    .expect({
                        statusCode: 409,
                        error: 'Conflict',
                        message:
                            'an account with email address hello@mail.com already exists',
                    });
            });
        });
    });

    describe('/GET Users', () => {
        describe('correct id for existing user is sent', () => {
            it(`should return the correct user and the id property should be without _`, () => {
                return request(app.getHttpServer())
                    .get(`/users/${newUserId}`)
                    .expect(200)
                    .then(data => expect(data.body).not.toHaveProperty('_id'));
            });
        });

        describe('incorrect ObjectId value was provided', () => {
            it(`should throw an exception`, () => {
                return request(app.getHttpServer())
                    .get(
                        `/users/${new mongoose.Types.ObjectId().toString()}324`
                    )
                    .expect({
                        statusCode: 400,
                        error: 'Bad Request',
                        message: 'wrong user id was provided',
                    });
            });
        });

        describe('correct ObjectId was passed but the user does not exists', () => {
            it(`should throw an exception`, () => {
                const objectId = new mongoose.Types.ObjectId().toString();
                return request(app.getHttpServer())
                    .get(`/users/${objectId}`)
                    .expect({
                        statusCode: 404,
                        error: 'Not Found',
                        message: `user with the id ${objectId} does not exists`,
                    });
            });
        });
    });

    afterAll(async () => {
        await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
        await app.close();
    });
});
