import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WorkshopModule } from './workshop/workshop.module';
import { RegistrationModule } from './registration/registration.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '10m',
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    WorkshopModule,
    RegistrationModule,
    LocationModule,
  ],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_GUARD, useClass: AuthGuard }, // by default protect all routes
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
