import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../generated/prisma/enums';

export const ROLES = Reflector.createDecorator<UserRole[]>();

export const Roles = (roles: UserRole[]) => ROLES(roles);
