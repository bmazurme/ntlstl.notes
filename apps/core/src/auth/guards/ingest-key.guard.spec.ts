import {
  ExecutionContext,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

import { IngestKeyGuard } from './ingest-key.guard';

const KEY = 'k'.repeat(40);

const setup = (
  env: Record<string, string | undefined>,
  author: unknown = { id: 7, email: 'me@example.com' },
) => {
  const users = { findByEmail: jest.fn().mockResolvedValue(author) };
  const config = { get: jest.fn((name: string) => env[name]) };
  const guard = new IngestKeyGuard(config as never, users as never);
  const request: { headers: Record<string, string>; user?: unknown } = {
    headers: {},
  };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;

  return { guard, users, request, context };
};

describe('IngestKeyGuard', () => {
  it('pretends the route does not exist while no key (or a short one) is configured', async () => {
    for (const NOTES_INGEST_KEY of [undefined, '', 'short']) {
      const { guard, context, request } = setup({ NOTES_INGEST_KEY });

      request.headers.authorization = `Bearer ${NOTES_INGEST_KEY}`;
      await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    }
  });

  it('refuses a missing, malformed or wrong key', async () => {
    for (const authorization of [
      undefined,
      '',
      KEY,
      `Basic ${KEY}`,
      `Bearer ${KEY}x`,
      'Bearer ',
    ]) {
      const { guard, context, request, users } = setup({
        NOTES_INGEST_KEY: KEY,
        EMAILS: 'me@example.com',
      });

      if (authorization !== undefined)
        request.headers.authorization = authorization;

      await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(users.findByEmail).not.toHaveBeenCalled();
    }
  });

  it('lets the right key in as the author named by NOTES_INGEST_EMAIL', async () => {
    const { guard, context, request, users } = setup({
      NOTES_INGEST_KEY: KEY,
      NOTES_INGEST_EMAIL: ' diary@example.com ',
      EMAILS: 'me@example.com',
    });

    request.headers.authorization = `Bearer ${KEY}`;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(users.findByEmail).toHaveBeenCalledWith('diary@example.com');
    expect(request.user).toEqual({ id: 7, email: 'me@example.com' });
  });

  it('falls back to the first of EMAILS', async () => {
    const { guard, context, request, users } = setup({
      NOTES_INGEST_KEY: KEY,
      EMAILS: ' first@example.com , second@example.com',
    });

    request.headers.authorization = `Bearer ${KEY}`;
    await guard.canActivate(context);

    expect(users.findByEmail).toHaveBeenCalledWith('first@example.com');
  });

  it('says 503 when the author has never signed in, or no author is configured', async () => {
    const missing = setup(
      { NOTES_INGEST_KEY: KEY, EMAILS: 'me@example.com' },
      null,
    );

    missing.request.headers.authorization = `Bearer ${KEY}`;
    await expect(
      missing.guard.canActivate(missing.context),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);

    const none = setup({ NOTES_INGEST_KEY: KEY });

    none.request.headers.authorization = `Bearer ${KEY}`;
    await expect(none.guard.canActivate(none.context)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    expect(none.users.findByEmail).not.toHaveBeenCalled();
  });
});
