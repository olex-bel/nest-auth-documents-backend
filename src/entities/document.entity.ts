import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import User from './user.entity';
import Folder from './folder.entity';

@Entity({ name: 'documents' })
@Index(['folderId', 'userId'])
export default class Document {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'folder_id' })
    folderId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column()
    checksum: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @ManyToOne(() => Folder)
    @JoinColumn({ name: 'folder_id', referencedColumnName: 'id' })
    folder: Folder;
}
