import { ValidationPipe } from '@nestjs/common';

import { CreateDraftDto } from './create-draft.dto';

const pipe = new ValidationPipe({ whitelist: true, transform: true });
const metadata = { type: 'body' as const, metatype: CreateDraftDto };

describe('CreateDraftDto', () => {
  it('drops published, reviewedAt and coverImage that a caller sends', async () => {
    const dto = (await pipe.transform(
      {
        title: 'Неделя 2–8 ноября',
        preview: 'Коротко',
        content: '## Итоги',
        type: { id: 6 },
        tags: ['lab'],
        published: true,
        reviewedAt: '2026-11-12T00:00:00.000Z',
        coverImage: 'https://example.com/x.png',
      },
      metadata,
    )) as Record<string, unknown>;

    expect(dto).not.toHaveProperty('published');
    expect(dto).not.toHaveProperty('reviewedAt');
    expect(dto).not.toHaveProperty('coverImage');
    expect(dto).toMatchObject({ title: 'Неделя 2–8 ноября', tags: ['lab'] });
  });

  it('still validates what the normal note needs', async () => {
    await expect(
      pipe.transform({ title: 'ab', preview: 'p', content: 'c' }, metadata),
    ).rejects.toThrow();
  });
});
