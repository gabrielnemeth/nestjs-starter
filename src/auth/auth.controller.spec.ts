import {Test, TestingModule} from '@nestjs/testing';
import * as mongoose from 'mongoose';
import {CreateUserDto} from '../users/create-user.dto';
import {UsersService} from '../users/users.service';
import {AuthController} from './auth.controller';

describe('AuthController', () => {
    let controller: AuthController;
    let service: UsersService;

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
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('register', () => {
        it('should create a new user', async () => {
            const createSpy = jest
                .spyOn(service, 'create')
                .mockResolvedValueOnce(mockUser);

            await controller.register(createUserDto);
            expect(createSpy).toHaveBeenCalled();
        });
    });
});
