import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';

export class UpdateDocumentDto {
    @Transform(({ value }) => sanitizeHtml(value))
    @IsString()
    @Length(2, 60)
    title: string;

    @Transform(({ value }) => sanitizeHtml(value))
    @IsString()
    @Length(2, 200)
    content: string;

    @IsString()
    previousChecksum: string;
}
