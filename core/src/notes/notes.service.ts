import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Note } from './entities/note.entity';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Type } from '../types/entities/type.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    const note = new Note();

    note.title = createNoteDto.title;
    note.content = createNoteDto.content;
    note.type = createNoteDto.type as Type;

    const { id } = await this.noteRepository.save(note);

    return this.noteRepository.findOne({
      where: { id },
      relations: {
        type: true,
      },
    });
  }

  async findAll(page: number = 1) {
    const take = 10; // количество записей на странице
    const skip = (page - 1) * take;

    const [results, total] = await this.noteRepository.findAndCount({
      relations: {
        type: true,
      },
      order: {
        id: 'ASC',
      },
      take,
      skip,
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
      },
    });

    return {
      data: results,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
