import { IsBoolean } from "class-validator";
import { Transform } from "class-transformer";
import { SearchQueryDto } from "../../folder/dto/search-query.dto";

export class GetFoldersDto extends SearchQueryDto {
    @IsBoolean()
    @Transform(({ value} ) => value === 'true')
    assigned: boolean;
}