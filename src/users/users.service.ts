import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../entities/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findOneByEmail(email: string): Promise<User> {
        return this.usersRepository.findOneBy({
            email,
        });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.email = createUserDto.email;
        user.password = createUserDto.password;
        user.enabled = true;
        return this.usersRepository.save(user);
    }

    async resetFailedLoginAttempts(user: User): Promise<void> {
        user.failedLoginAttempts = 0;
        await this.usersRepository.save(user);
    }

    async incrementFailedLoginAttempts(user: User): Promise<void> {
        user.failedLoginAttempts += 1;
        if (user.failedLoginAttempts >= 5) {
            user.enabled = false;
        }
        await this.usersRepository.save(user);
    }
}
