import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {CreateUserDto} from './create-user.dto';
import {UserResponse} from './user.response';
import {UsersService} from './users.service';

@Controller()
export class UsersController {
    public constructor(private readonly usersService: UsersService) {}

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

    @Get('users/:id')
    public async findOne(@Param('id') id: string): Promise<UserResponse> {
        const user = await this.usersService.findOne(id);
        return new UserResponse(user);
    }
}
