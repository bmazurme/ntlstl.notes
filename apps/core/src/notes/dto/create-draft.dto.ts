import { OmitType } from '@nestjs/mapped-types';

import { CreateNoteDto } from './create-note.dto';

/**
 * Тело `POST /api/v1/notes/drafts`. Без `published` и `reviewedAt`: ручка по ключу всегда создаёт неопубликованный
 * черновик, публикует его владелец из редактора. Без `coverImage` — обложка задаётся вручную. Лишние поля
 * отбрасывает ValidationPipe (whitelist).
 */
export class CreateDraftDto extends OmitType(CreateNoteDto, [
  'published',
  'reviewedAt',
  'coverImage',
] as const) {}
