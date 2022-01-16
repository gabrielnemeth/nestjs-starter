import {Body, Controller, Post, Response, UseGuards} from '@nestjs/common';
import {CreateUserDto} from '../users/create-user.dto';
import {UserResponse} from '../users/user.response';
import {UsersService} from '../users/users.service';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from './local-auth.guard';

@Controller('auth')
export class AuthController {
    public constructor(
        public authService: AuthService,
        public usersService: UsersService
    ) {}

    @Post('register')
    public async register(
        @Body() createUserDto: CreateUserDto
    ): Promise<UserResponse> {
        const user = await this.authService.register(createUserDto);
        return new UserResponse(user);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    public async login(
        @Body('email') email: string,
        @Response({passthrough: true}) res
    ): Promise<UserResponse> {
        const user = await this.usersService.findOneByEmail(email);
        const tokens = await this.authService.generateTokens(
            user._id.toString()
        );
        res.cookie('access', tokens.access, {httpOnly: true});
        res.cookie('refresh', tokens.refresh, {httpOnly: true});
        return new UserResponse(user);
    }
}
