import {Body, Controller, Post} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {CreateUserDto} from '../users/create-user.dto';
import {UserResponse} from '../users/user.response';
import {UsersService} from '../users/users.service';

@Controller('auth')
export class AuthController {
    public constructor(public usersService: UsersService) {}

    @Post('register')
    public async register(
        @Body() createUserDto: CreateUserDto
    ): Promise<UserResponse> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
        const user = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return new UserResponse(user);
    }
}
