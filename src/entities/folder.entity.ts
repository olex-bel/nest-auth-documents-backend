import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'folders' })
export default class Folder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
}
