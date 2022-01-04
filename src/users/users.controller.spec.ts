import {Test, TestingModule} from '@nestjs/testing';
import * as mongoose from 'mongoose';
import {CreateUserDto} from './create-user.dto';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';

describe('UserController', () => {
    let controller: UsersController;
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
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
            ],
            controllers: [UsersController],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createSpy = jest
                .spyOn(service, 'create')
                .mockResolvedValueOnce(mockUser);

            await controller.create(createUserDto);
            expect(createSpy).toHaveBeenCalledWith(createUserDto);
        });
    });

    describe('findOne', () => {
        it('should return one user', async () => {
            const createSpy = jest
                .spyOn(service, 'findOne')
                .mockResolvedValueOnce(mockUser);

            await controller.findOne(new mongoose.Types.ObjectId().toString());
            expect(createSpy).toHaveBeenCalled();
        });
    });
});
