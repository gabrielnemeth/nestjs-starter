import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class TokenService {
    private accessSecret = this.configService.get('JWT_ACCESS_SECRET_KEY');
    private refreshSecret = this.configService.get('JWT_REFRESH_SECRET_KEY');
    private accessExpiresIn = this.configService.get(
        'JWT_ACCESS_EXPIRE_IN_SECONDS'
    );
    private refreshExpiresIn = this.configService.get(
        'JWT_REFRESH_EXPIRE_IN_SECONDS'
    );

    public constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    public generateAccessToken(userId: string): Promise<string> {
        return this.generate(userId, this.accessSecret, this.accessExpiresIn);
    }

    public generateRefreshToken(userId: string): Promise<string> {
        return this.generate(userId, this.refreshSecret, this.refreshExpiresIn);
    }

    private generate(
        userId: string,
        secret: string,
        expiresIn: string | number
    ): Promise<string> {
        return this.jwtService.signAsync(
            {sub: userId},
            {
                secret,
                expiresIn,
            }
        );
    }
}
