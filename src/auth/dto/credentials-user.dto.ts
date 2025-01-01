import { IsNotEmpty, IsEmail } from 'class-validator';

export class CredentialsUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}