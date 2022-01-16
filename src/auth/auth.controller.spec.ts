import {ConfigService} from '@nestjs/config';
import {Test, TestingModule} from '@nestjs/testing';
import * as mongoose from 'mongoose';
import {CreateUserDto} from '../users/create-user.dto';
import {UsersService} from '../users/users.service';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    const createUserDto: CreateUserDto = {
        email: 'hello@mail.com',
        password: 'secret',
    };

    const mockUser = {
        email: 'hello@mail.com',
        password: 'secret',
        _id: new mongoose.Types.ObjectId(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        register: jest.fn(),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {},
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue(600),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('register', () => {
        it('should create a new user', async () => {
            const createSpy = jest
                .spyOn(authService, 'register')
                .mockResolvedValueOnce(mockUser);

            await controller.register(createUserDto);
            expect(createSpy).toHaveBeenCalled();
        });
    });
});
