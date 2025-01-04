import { IsString, MinLength } from 'class-validator';

export class RenameFolderDto {
    @IsString()
    @MinLength(3)
    name: string;
}   