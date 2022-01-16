import {Body, Controller, Get, Post, Response, UseGuards} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {add} from 'date-fns';
import {CreateUserDto} from '../users/create-user.dto';
import {UserResponse} from '../users/user.response';
import {UsersService} from '../users/users.service';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from './local-auth.guard';

@Controller('auth')
export class AuthController {
    private accessExpiresIn = this.configService.get(
        'JWT_ACCESS_EXPIRE_IN_SECONDS'
    );
    private refreshExpiresIn = this.configService.get(
        'JWT_REFRESH_EXPIRE_IN_SECONDS'
    );

    public constructor(
        public authService: AuthService,
        public usersService: UsersService,
        public configService: ConfigService
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
        const accessExp = add(new Date(), {seconds: this.accessExpiresIn});
        const refreshExp = add(new Date(), {seconds: this.refreshExpiresIn});

        res.cookie('access', tokens.access, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            expires: accessExp,
        });
        res.cookie('refresh', tokens.refresh, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            expires: refreshExp,
        });
        return new UserResponse(user);
    }

    @Get('logout')
    public async logout(@Response({passthrough: true}) res): Promise<void> {
        res.clearCookie('access', {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });
        res.clearCookie('refresh', {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });
    }
}
