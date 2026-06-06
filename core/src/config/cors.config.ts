import { INestApplication } from '@nestjs/common';

export const configureCors = (app: INestApplication) => {
  const raw = process.env.CORS_ORIGINS ?? '';
  const origin = raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origin.length ? origin : false,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 3600,
    optionsSuccessStatus: 204,
  });
};
