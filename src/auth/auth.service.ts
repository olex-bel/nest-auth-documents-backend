import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDisabledError, UserAlreadyExistsError } from './errors';
import User from '../entities/user.entity';

const SALT_OR_ROUNDS = 10;

type SanitizedUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) { }

    async validateUser(email: string, pass: string): Promise<SanitizedUser | null> {
        const user = await this.usersService.findOneByEmail(email);

        if (!user) {
            return null;
        }

        if (!user.enabled) {
            throw new UserDisabledError();
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (isMatch) {
            const { password, ...result } = user;
            await this.usersService.resetFailedLoginAttempts(user);
            return result;
        } else {
            await this.usersService.incrementFailedLoginAttempts(user);
        }

        return null;
    }


    async login(user: any) {
        const payload = { sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.findOneByEmail(createUserDto.email);

        if (user) {
            throw new UserAlreadyExistsError();
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_OR_ROUNDS);

        return this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });
    }
}
