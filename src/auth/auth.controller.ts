import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
import {CreateUserDto} from '../users/create-user.dto';
import {UserResponse} from '../users/user.response';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from './local-auth.guard';

@Controller('auth')
export class AuthController {
    public constructor(public authService: AuthService) {}

    @Post('register')
    public async register(
        @Body() createUserDto: CreateUserDto
    ): Promise<UserResponse> {
        const user = await this.authService.register(createUserDto);
        return new UserResponse(user);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    public async login(@Request() req): Promise<UserResponse> {
        return new UserResponse(req.user);
    }
}
