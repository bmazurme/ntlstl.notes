import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
// import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

export const configureCors = (app: INestApplication) => {
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 3600,
    optionsSuccessStatus: 204,
  });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  configureCors(app);
  await app.listen(3000);
}
bootstrap();
