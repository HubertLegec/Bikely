import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../types/roles';

export const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);
