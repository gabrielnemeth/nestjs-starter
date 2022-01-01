import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import {isNil} from '@nestjs/common/utils/shared.utils';
import {InjectModel} from '@nestjs/mongoose';
import {isValidObjectId, Model} from 'mongoose';
import {CreateUserDto} from './create-user.dto';
import {User, UserDocument} from './user.schema';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    public constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {}

    public async create(createUserDto: CreateUserDto): Promise<User> {
        const exists = await this.exists(createUserDto.email);
        if (exists) {
            throw new ConflictException(
                `an account with email address ${createUserDto.email} already exists`
            );
        }

        const user = await this.userModel.create(createUserDto);
        this.logger.log(`A new user created: ${JSON.stringify(user)}`);
        return user.toObject();
    }

    public async findOne(id: string): Promise<User> {
        if (!isValidObjectId(id)) {
            throw new NotFoundException(
                `user with the id of ${id} does not exists`
            );
        }
        return this.userModel.findById(id).lean();
    }

    private async exists(email: string): Promise<boolean> {
        const user = await this.userModel.findOne({email});
        return !isNil(user);
    }
}
