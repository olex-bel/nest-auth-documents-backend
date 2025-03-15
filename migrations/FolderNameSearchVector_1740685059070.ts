import { MigrationInterface, QueryRunner } from 'typeorm'

export class FolderNameSearchVector1740685059070 implements MigrationInterface {
    name = 'FolderNameSearchVector1740685059070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX "IDX_foldersNameFullTextSearch" 
            ON "folders" 
            USING GIN ("name_full_text_search");
        `)

        // Populate the fullTextSearch column for existing records
        await queryRunner.query(`
            UPDATE "folders" f
            SET "name_full_text_search" = to_tsvector(coalesce(name,''));
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_foldersNameFullTextSearch";
        `)
    }
}