import { IsString, IsOptional } from 'class-validator';
import { SearchQueryDto } from "./search-query.dto";

export class AllFolderSearchDto extends SearchQueryDto {
    @IsString()
    @IsOptional()
    userId?: string;
}