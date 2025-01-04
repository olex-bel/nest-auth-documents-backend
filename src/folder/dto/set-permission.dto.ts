
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SetPermissionsDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsNumber()
    @IsNotEmpty()
    permissionId: number;
}
