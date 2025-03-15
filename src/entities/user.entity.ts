import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ default: true })
    enabled: boolean;

    @Column({ name: 'failed_login_attempts', default: 0 })
    @Exclude()
    failedLoginAttempts: number;
}
