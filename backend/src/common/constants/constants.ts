import { Request } from 'express';
import { UserRole } from '../../../generated/prisma/enums';

export class CurrentUserType {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
}

export interface RequestWithUser extends Request {
  user: CurrentUserType;
}
