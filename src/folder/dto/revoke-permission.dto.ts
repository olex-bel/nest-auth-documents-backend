import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RevokePermissionDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsNumber()
    @IsNotEmpty()
    permissionId: number;
}