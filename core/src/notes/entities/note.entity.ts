import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
// Обратные ссылки (backlinks) вычисляются динамически по содержимому заметок
// (см. NotesService.findBacklinks), поэтому отдельная связь note→note не нужна.

import { BaseEntity } from '../../base.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Type } from '../../types/entities/type.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Note extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    default: 'Без названия',
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 180,
    unique: true,
    nullable: true,
  })
  slug: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  preview: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  content: string;

  /** Абсолютный URL обложки (og:image / twitter:image). Необязателен. */
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  coverImage: string | null;

  @ManyToOne(() => Type, (type) => type.notes, {
    nullable: false,
  })
  @JoinColumn({ name: 'typeId' })
  type: Type;

  @ManyToMany(() => Tag, (tag) => tag.notes)
  @JoinTable({
    name: 'note_tags',
    joinColumn: { name: 'noteId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @ManyToOne(() => User, (user) => user.notes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creatorId' }) // Название колонки в БД
  creator: User;
}
