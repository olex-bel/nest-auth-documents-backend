import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'folders' })
export default class Folder {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;
}
