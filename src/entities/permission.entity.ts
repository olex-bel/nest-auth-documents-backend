import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'permissions' })
export default class Permission {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;
}
