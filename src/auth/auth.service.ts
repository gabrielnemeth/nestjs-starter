import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {CreateUserDto} from '../users/create-user.dto';
import {User} from '../users/user.schema';
import {UsersService} from '../users/users.service';

@Injectable()
export class AuthService {
    public constructor(private usersService: UsersService) {}

    public async register(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
        return this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });
    }

    public async validateUser(
        email: string,
        password: string
    ): Promise<User | null> {
        const user = await this.usersService.findOneByEmail(email);

        if (user) {
            const passwordMatch = await bcrypt.compare(
                password,
                user?.password
            );
            if (passwordMatch) {
                return user;
            }
        }
        return null;
    }
}
