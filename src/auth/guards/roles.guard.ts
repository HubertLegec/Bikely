import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RolesEnum } from '../../types/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<RolesEnum[]>('roles', context.getHandler());

    if (!roles) return true;
    const { user } = context.switchToHttp().getRequest();

    return roles.find((role) => role === user.role) ? true : false;
  }
}
