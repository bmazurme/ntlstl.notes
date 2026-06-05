import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import LokiTransport from 'winston-loki';

const isDev = process.env.NODE_ENV === 'development';

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    nestWinstonModuleUtilities.format.nestLike('App', {
      prettyPrint: true,
      colors: true,
    }),
  ),
});

const rotateTransport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '20m',
  zippedArchive: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

const prodTransports = isDev
  ? []
  : [
      new LokiTransport({
        host: process.env.LOKI_HOST ?? 'http://localhost:3100',
        labels: { app: 'core', env: process.env.NODE_ENV ?? 'production' },
        json: true,
        format: winston.format.json(),
        replaceTimestamp: true,
        onConnectionError: (err) =>
          console.error('Loki connection error:', err),
      }),
    ];

export const winstonConfig: winston.LoggerOptions = {
  level: isDev ? 'debug' : 'info',
  transports: isDev
    ? [consoleTransport, rotateTransport]
    : [consoleTransport, ...prodTransports],
};
