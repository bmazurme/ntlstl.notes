import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../base.entity';
import { Type } from '../../types/entities/type.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Note extends BaseEntity {
  @Column({
    unique: false,
    nullable: false,
  })
  title: string;

  @Column({ type: 'text' }) // или @Column({ type: 'varchar', length: 10000 })
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
