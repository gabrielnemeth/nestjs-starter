import {
    BadRequestException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import {getModelToken} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {Model} from 'mongoose';
import * as mongoose from 'mongoose';
import {User} from './user.schema';
import {UsersService} from './users.service';

describe('UsersService', () => {
    let service: UsersService;
    let model: Model<User>;
    const id1 = new mongoose.Types.ObjectId();
    const id2 = new mongoose.Types.ObjectId();

    const usersArray = [
        {
            _id: id1,
            email: 'hello@mail.com',
            password: 'secret',
        },
        {
            _id: id2,
            email: 'hello2@mail.com',
            password: 'secret',
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        create: jest.fn(),
                        findById: jest.fn(),
                        findOne: jest.fn(),
                        lean: jest.fn(),
                        exec: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        model = module.get<Model<User>>(getModelToken('User'));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        describe('when user already exists', () => {
            it('should throw a ConflictException', async () => {
                jest.spyOn(model, 'findOne').mockResolvedValueOnce(
                    usersArray[0] as any
                );

                const userDto = {
                    email: 'hello@mail.com',
                    password: 'secret',
                };

                expect.assertions(2);
                try {
                    await service.create(userDto);
                } catch (err) {
                    expect(err).toBeInstanceOf(ConflictException);
                    expect(err.message).toBe(
                        `an account with email address ${usersArray[0].email} already exists`
                    );
                }
            });
        });

        describe('when user not exists', () => {
            it('should create and return the user', async () => {
                jest.spyOn(model, 'findOne').mockResolvedValueOnce(null as any);
                jest.spyOn(model, 'create').mockImplementationOnce(() => ({
                    toObject: jest
                        .fn()
                        .mockResolvedValueOnce(usersArray[0] as any),
                }));

                const userDto = {
                    email: 'hello@mail.com',
                    password: 'secret',
                };

                const newUser = await service.create(userDto);
                expect(newUser).toBe(usersArray[0]);
            });
        });
    });

    describe('findOne', () => {
        describe('when user with id exists', () => {
            it('should return the correct user', async () => {
                jest.spyOn(model, 'findById').mockImplementationOnce(
                    () =>
                        ({
                            lean: jest.fn().mockImplementationOnce(() => ({
                                exec: jest.fn().mockReturnValue(usersArray[0]),
                            })),
                        } as any)
                );
                const user = await service.findOne(id1.toString());
                expect(user).toEqual(usersArray[0]);
            });
        });

        describe('when the id is not an ObjectId', () => {
            it('should throw a BadRequestException', async () => {
                expect.assertions(2);
                try {
                    await service.findOne('notobjectid');
                } catch (err) {
                    expect(err).toBeInstanceOf(BadRequestException);
                    expect(err.message).toBe('wrong user id was provided');
                }
            });
        });

        describe('when the user does not exists', () => {
            it('should throw a NotFoundException', async () => {
                jest.spyOn(model, 'findById').mockImplementationOnce(
                    () =>
                        ({
                            lean: jest.fn().mockImplementationOnce(() => ({
                                exec: jest.fn().mockReturnValue(null),
                            })),
                        } as any)
                );
                const nonExistingId = new mongoose.Types.ObjectId();

                expect.assertions(2);
                try {
                    await service.findOne(nonExistingId.toString());
                } catch (err) {
                    expect(err).toBeInstanceOf(NotFoundException);
                    expect(err.message).toBe(
                        `user with the id ${nonExistingId.toString()} does not exists`
                    );
                }
            });
        });
    });
});
