import {IsDefined, IsEmail, IsString, MinLength} from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsDefined()
    public readonly email: string;

    @IsString()
    @IsDefined()
    @MinLength(6)
    public readonly password: string;
}
