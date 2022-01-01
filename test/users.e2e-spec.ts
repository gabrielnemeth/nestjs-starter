import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {UsersModule} from '../src/users/users.module';
import {UsersService} from '../src/users/users.service';

describe('Users', () => {
    let app: INestApplication;
    const usersService = {findAll: (): string[] => ['test']};

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [UsersModule],
        })
            .overrideProvider(UsersService)
            .useValue(usersService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/GET users`, () => {
        return request(app.getHttpServer()).get('/users').expect(200).expect({
            data: usersService.findAll(),
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
