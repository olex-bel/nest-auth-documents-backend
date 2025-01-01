import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';
export const RequirePermissions = (permission: string) => SetMetadata(PERMISSION_KEY, permission);