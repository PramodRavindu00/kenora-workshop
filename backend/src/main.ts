process.env.TZ = 'UTC';

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import { PrismaExceptionFilter } from './common/filters/prisma.exception.filter';
import { validationExceptionFactory } from './common/utils/validation-exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());

  const PORT = process.env.PORT ?? 8080;
  await app.listen(PORT);
}
bootstrap();
