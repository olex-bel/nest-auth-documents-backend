import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'roles' })
export default class Role {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;
}
