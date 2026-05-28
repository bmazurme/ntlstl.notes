import {
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TypeIdDto } from '../../types/dto/type-id.dto';

export class CreateNoteDto {
  @IsString({ message: 'Название должно быть строкой' })
  @MinLength(2, { message: 'Название должно содержать минимум 2 символа' })
  @MaxLength(100, { message: 'Название не может превышать 100 символов' })
  title: string;

  @IsString({ message: 'Название должно быть строкой' })
  preview: string;

  @IsString({ message: 'Название должно быть строкой' })
  content: string;

  @Type(() => TypeIdDto)
  @IsObject({ message: 'Тип документа должен быть объектом' })
  @IsNotEmpty({ message: 'Тип документа обязателен для указания' })
  type: TypeIdDto;
}
