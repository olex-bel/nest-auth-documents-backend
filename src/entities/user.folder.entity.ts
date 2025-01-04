import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Index } from 'typeorm';
import User from './user.entity';
import Permission from './permission.entity';
import Folder from './folder.entity';

@Entity({ name: 'user_folders' })
@Index(['userId', 'folderId'])
export default class UserFolder {
    @PrimaryColumn({ name: 'user_id' })
    userId: string;

    @PrimaryColumn({ name: 'folder_id' })
    folderId: string;

    @PrimaryColumn({ name: 'permission_id' })
    permissionId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @ManyToOne(() => Folder)
    @JoinColumn({ name: 'folder_id', referencedColumnName: 'id' })
    folder: Folder;

    @ManyToOne(() => Permission)
    @JoinColumn({ name: 'permission_id', referencedColumnName: 'id' })
    permission: Permission;
}
