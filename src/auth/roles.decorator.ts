import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/types/roles';

export const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);
