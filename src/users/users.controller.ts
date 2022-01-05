import {Controller, Get, Param} from '@nestjs/common';
import {UserResponse} from './user.response';
import {UsersService} from './users.service';

@Controller('users')
export class UsersController {
    public constructor(private readonly usersService: UsersService) {}

    @Get(':id')
    public async findOne(@Param('id') id: string): Promise<UserResponse> {
        const user = await this.usersService.findOne(id);
        return new UserResponse(user);
    }
}
