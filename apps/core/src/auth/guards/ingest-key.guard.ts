import { createHash, timingSafeEqual } from 'node:crypto';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../../users/users.service';

// Ключ должен быть длинным и случайным: им одним закрыта ручка, которая пишет в публичный сайт.
export const INGEST_KEY_MIN_LENGTH = 32;

const sha256 = (value: string) => createHash('sha256').update(value).digest();

/**
 * Машинный доступ к ОДНОЙ ручке — `POST /api/v1/notes/drafts` (создать черновик). Ключ `NOTES_INGEST_KEY` приходит как
 * `Authorization: Bearer <ключ>`; им нельзя ничего читать, публиковать, править или удалять — для этого остаётся сессия
 * через Яндекс.
 *
 * - Ключ не задан или короче INGEST_KEY_MIN_LENGTH — ручки «нет» (404), как до этого изменения.
 * - Автор черновика — пользователь с почтой `NOTES_INGEST_EMAIL` (или первой из `EMAILS`): заметке нужен автор, а у ключа
 *   своего пользователя нет. Такого пользователя ещё нет (никто не входил) — 503, а не молчаливое создание.
 */
@Injectable()
export class IngestKeyGuard implements CanActivate {
  private readonly logger = new Logger(IngestKeyGuard.name);

  constructor(
    private readonly config: ConfigService,
    private readonly users: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const key = this.config.get<string>('NOTES_INGEST_KEY');

    if (!key || key.length < INGEST_KEY_MIN_LENGTH) {
      throw new NotFoundException();
    }

    const request = context.switchToHttp().getRequest();
    const header: unknown = request.headers?.authorization;
    const given =
      typeof header === 'string' && header.startsWith('Bearer ')
        ? header.slice('Bearer '.length).trim()
        : '';

    if (!given || !timingSafeEqual(sha256(given), sha256(key))) {
      throw new UnauthorizedException();
    }

    const email = this.authorEmail();
    const author = email ? await this.users.findByEmail(email) : null;

    if (!author) {
      this.logger.warn(
        'Ingest key is valid but the author user does not exist',
      );

      throw new ServiceUnavailableException(
        'Пользователь-автор для черновиков не найден: войдите на сайт хотя бы раз',
      );
    }

    request.user = author;

    return true;
  }

  private authorEmail(): string | null {
    const explicit = this.config.get<string>('NOTES_INGEST_EMAIL')?.trim();

    if (explicit) return explicit;

    const first = this.config
      .get<string>('EMAILS')
      ?.split(',')
      .map((email) => email.trim())
      .find(Boolean);

    return first ?? null;
  }
}
