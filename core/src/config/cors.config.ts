import { INestApplication } from '@nestjs/common';

export const configureCors = (app: INestApplication) => {
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'http://localhost',
      'http://client:80',
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 3600,
    optionsSuccessStatus: 204,
  });
};
