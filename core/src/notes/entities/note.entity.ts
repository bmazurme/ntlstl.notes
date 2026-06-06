import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../base.entity';
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
    type: 'text',
    nullable: false,
  })
  preview: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  content: string;

  @ManyToOne(() => Type, (type) => type.notes, {
    nullable: false,
  })
  @JoinColumn({ name: 'typeId' })
  type: Type;

  @ManyToOne(() => User, (user) => user.notes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creatorId' }) // Название колонки в БД
  creator: User;
}
