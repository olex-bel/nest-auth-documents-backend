
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserDisabledError, CredentialsValidationError } from '../errors';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' })
    }

    async validate(email: string, password: string): Promise<any> {
        let user;
        
        try {
            user = await this.authService.validateUser(email, password);
        } catch (error) {
            if (error instanceof UserDisabledError) {
                throw new ForbiddenException();
            }
            if (error instanceof CredentialsValidationError) {
                throw new BadRequestException();
            }

            throw error;
        }

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
