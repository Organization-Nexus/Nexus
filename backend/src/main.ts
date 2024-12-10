import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { AllExceptionsFilter } from './common/filters/all.exception.filter';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.BE_PORT;
  const API_PREFIX = process.env.API_PREFIX;

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

  app.enableCors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(PORT, () => {
    console.log(`🚀 Running API in Mode: ${process.env.NODE_ENV}`);
    console.log(`📡 Backend URL: ${PORT}`);
  });
}
bootstrap();
