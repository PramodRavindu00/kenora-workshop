import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from '../decorators/roles.decorator';
import { RequestWithUser } from '../constants/constants';
import { UserRole } from '../../../generated/prisma/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!allowedRoles?.length) {
      return true;
    }

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
