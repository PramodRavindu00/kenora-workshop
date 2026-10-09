import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { UserRole } from '../../generated/prisma/enums';
import { PrismaService } from '../common/prisma/prisma.service';
import { passwordHash } from '../common/utils/bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CurrentUserType } from '../common/constants/constants';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createAdminIfNotExists();
  }

  async createAdminIfNotExists() {
    const email = this.configService
      .getOrThrow<string>('ADMIN_EMAIL')
      .trim()
      .toLowerCase();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      return;
    }

    const name = this.configService.get<string>('ADMIN_NAME') ?? 'Admin';
    const password = this.configService.getOrThrow<string>('ADMIN_PASSWORD');

    await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await passwordHash(password),
        role: UserRole.ADMIN,
        createdBy: 'system',
        updatedBy: 'system',
      },
    });

    this.logger.log(`Admin account created for ${email}`);
  }

 

 

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return plainToInstance(UserResponseDto, user);
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return plainToInstance(UserResponseDto, user);
  }

  async createUser(dto: CreateUserDto, user: CurrentUserType) {
    const password = await passwordHash(dto.password);
    return this.prisma.user.create({
      data: {
        ...dto,
        passwordHash: password,
        createdBy: user.id,
        updatedBy: user.id,
      },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto, user: CurrentUserType) {
    await this.prisma.user.update({
      where: { id },
      data: { ...dto, updatedBy: user.id },
    });
  }

  async deactivateUser(id: string, user: CurrentUserType) {
    await this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: user.id,
      },
    });
  }
}
