import { 
    Controller, UseGuards, Post, Request, Body,
    ConflictException, ClassSerializerInterceptor, UseInterceptors
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from '../decorators/public.decorator';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UserAlreadyExistsError } from './errors';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Public()
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            const user = await this.authService.register(createUserDto);
            return user;
        } catch (error) {
            if (error instanceof UserAlreadyExistsError) {
                throw new ConflictException('User already exists');
            }
            throw error;
        }
    }
}
