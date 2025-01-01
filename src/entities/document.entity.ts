import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from './user.entity';
import Folder from './folder.entity';

@Entity({ name: 'documents' })
export default class Document {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at' })
    updatedAt: Date;

    @Column()
    checksum: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Folder)
    folder: Folder;
}
