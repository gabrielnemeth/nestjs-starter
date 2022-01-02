import {getModelToken} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {Model} from 'mongoose';
import * as mongoose from 'mongoose';
import {User} from './user.schema';
import {UsersService} from './users.service';

const mockCat = {
    name: 'Cat #1',
    breed: 'Breed #1',
    age: 4,
};

describe('CatsService', () => {
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
                    provide: getModelToken('User'),
                    useValue: {
                        create: jest.fn(),
                        findById: jest.fn(),
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

    it('should return the correct user', async () => {
        jest.spyOn(model, 'findById').mockReturnValue(usersArray[0] as any);
        const cats = await service.findOne(id1.toString());
        expect(cats).toEqual(usersArray[0]);
    });
});
