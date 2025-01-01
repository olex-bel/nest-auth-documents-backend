import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import User from './user.entity';
import Role from './role.entity';

@Entity({ name: 'user_roles' })
export default class UserRole {
    @PrimaryColumn({ name: 'user_id' })
    userId: string;

    @PrimaryColumn({ name: 'role_id' })
    roleId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
    role: Role;
}