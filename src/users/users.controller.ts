import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {CreateUserDto} from './create-user.dto';
import {UserResponse} from './user.response';
import {UsersService} from './users.service';

@Controller('users')
export class UsersController {
    public constructor(private readonly usersService: UsersService) {}

    @Post()
    public async create(
        @Body() createUserDto: CreateUserDto
    ): Promise<UserResponse> {
        const user = await this.usersService.create(createUserDto);
        return new UserResponse(user);
    }

    @Get(':id')
    public async findOne(@Param('id') id: string): Promise<UserResponse> {
        const user = await this.usersService.findOne(id);
        return new UserResponse(user);
    }
}
