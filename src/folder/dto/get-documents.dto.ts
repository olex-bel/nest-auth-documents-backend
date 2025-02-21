
import { IsString, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetDocumentDto {
    @IsString()
    @IsOptional()
    cursor?: string;

    @Type(() => Number)
    @IsInt()
    @Min(10)
    @Max(100)
    limit: number;
}