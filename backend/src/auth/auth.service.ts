import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthTokens, JwtPayload } from '../common/constants/constants';
import { UserRole } from '../../generated/prisma/enums';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { comparePassword } from '../common/utils/bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async login(dto: LoginDto): Promise<AuthTokens> {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordMatching = await comparePassword(password, user.passwordHash);

    if (!isPasswordMatching)
      throw new UnauthorizedException('Invalid credentials');
    return this.generateAuthTokens(user.id, user.email, user.role);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token not found');
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      return this.generateAuthTokens(user.id, user.email,user.role);
    } catch (error: any) {
      console.error('Tokens refreshing failed :', error.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateAuthTokens(
    userId: string,
    email: string,
    role: UserRole,
  ): AuthTokens {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
      role,
    };
    const accessToken = this.jwtService.sign(jwtPayload);
    return {
      accessToken,
    };
  }
}
