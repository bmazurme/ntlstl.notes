import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TypeIdDto } from '../../types/dto/type-id.dto';

export class CreateNoteDto {
  @IsString({ message: 'Название должно быть строкой' })
  @MinLength(3, { message: 'Название должно содержать минимум 3 символа' })
  @MaxLength(150, { message: 'Название не может превышать 150 символов' })
  title: string;

  @IsString({ message: 'Название должно быть строкой' })
  preview: string;

  @IsString({ message: 'Название должно быть строкой' })
  content: string;

  @Type(() => TypeIdDto)
  @IsObject({ message: 'Тип документа должен быть объектом' })
  @IsNotEmpty({ message: 'Тип документа обязателен для указания' })
  type: TypeIdDto;

  @IsOptional()
  @IsArray({ message: 'Теги должны быть массивом' })
  @ArrayMaxSize(30, { message: 'Не более 30 тегов на заметку' })
  @IsString({ each: true, message: 'Каждый тег должен быть строкой' })
  @MaxLength(50, { each: true, message: 'Тег не может превышать 50 символов' })
  tags?: string[];
}
