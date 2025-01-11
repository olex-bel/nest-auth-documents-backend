import { IsString, Length } from 'class-validator';

export class UpdateDocumentDto {
    @IsString()
    @Length(2, 60)
    title: string;

    @IsString()
    @Length(2, 200)
    content: string;

    @IsString()
    previousChecksum: string;
}
