import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'folders' })
@Index('IDX_foldersNameFullTextSearch', { synchronize: false })
export default class Folder {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column({
        type: 'tsvector',
        nullable: true,
        name: 'name_full_text_search',
    })
    nameFullTextSearch: string;
}
