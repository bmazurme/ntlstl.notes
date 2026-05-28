import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Note } from './entities/note.entity';
import { Type } from '../types/entities/type.entity';
import { User } from '../users/entities/user.entity';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, user: User) {
    this.logger.log('Creating new note', {
      userId: user.id,
      title: createNoteDto.title,
    });

    try {
      const note = new Note();

      note.title = createNoteDto.title;
      note.preview = createNoteDto.preview;
      note.content = createNoteDto.content;
      note.type = createNoteDto.type as Type;
      note.creator = user;

      this.logger.debug('Preparing to save new note with data', {
        title: note.title,
        typeId: note.type?.id,
        creatorId: user.id,
      });

      const { id } = await this.noteRepository.save(note);

      this.logger.debug('Note saved successfully', {
        noteId: id,
      });

      const result = await this.noteRepository.findOne({
        where: { id },
        relations: {
          type: true,
        },
      });

      this.logger.log('Note created successfully', {
        noteId: result?.id,
        title: result?.title,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to create note', {
        error: error.message,
        stack: error.stack,
        userId: user.id,
        title: createNoteDto.title,
      });
      throw error;
    }
  }

  async findAll(page: number) {
    this.logger.log('Fetching notes list', { page });

    const take = 10;
    const skip = (page - 1) * take;

    this.logger.debug('Pagination parameters', { page, take, skip });

    try {
      const [results, total] = await this.noteRepository.findAndCount({
        relations: {
          type: true,
        },
        order: {
          id: 'DESC',
        },
        take,
        skip,
        select: {
          id: true,
          title: true,
          preview: true,
          content: true,
          type: true,
        },
      });

      this.logger.debug('Notes fetched successfully', {
        count: results.length,
        total,
        page,
      });

      return {
        data: results,
        total,
      };
    } catch (error) {
      this.logger.error('Failed to fetch notes list', {
        error: error.message,
        page,
        stack: error.stack,
      });

      throw error;
    }
  }

  async findOne(id: number) {
    this.logger.log('Fetching note by ID', { id });

    try {
      const document = await this.noteRepository.findOne({
        where: { id },
        relations: {
          type: true,
        },
        select: {
          id: true,
          title: true,
          preview: true,
          content: true,
          type: {
            id: true,
            name: true,
          },
        },
      });

      if (!document) {
        this.logger.error('Not Found');
        throw new NotFoundException();
      }

      return document;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Failed to fetch note', {
        error: error.message,
        id,
        stack: error.stack,
      });
      throw error;
    }
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    this.logger.log('Updating note', { id, updateData: updateNoteDto });

    try {
      const existingNote = await this.noteRepository.findOne({
        where: { id },
        relations: {
          type: true,
        },
      });

      if (!existingNote) {
        this.logger.error(`Note with ID ${id} not found`);
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      if (updateNoteDto.title !== undefined) {
        existingNote.title = updateNoteDto.title;
      }

      if (updateNoteDto.preview !== undefined) {
        existingNote.preview = updateNoteDto.preview;
      }

      if (updateNoteDto.content !== undefined) {
        existingNote.content = updateNoteDto.content;
      }

      if (updateNoteDto.type !== undefined) {
        existingNote.type = updateNoteDto.type as Type;
      }

      const updatedNote = await this.noteRepository.save(existingNote);

      this.logger.debug('Note updated in database', {
        id: updatedNote.id,
      });

      const result = await this.noteRepository.findOne({
        where: { id: updatedNote.id },
        relations: {
          type: true,
        },
        select: {
          id: true,
          title: true,
          preview: true,
          content: true,
          type: {
            id: true,
            name: true,
          },
        },
      });

      this.logger.log('Note updated successfully', {
        id: result?.id,
        title: result?.title,
      });

      return result as Note;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Failed to update note', {
        error: error.message,
        id,
        updateData: updateNoteDto,
        stack: error.stack,
      });

      throw error;
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    this.logger.log('Deleting note', { id });

    try {
      const noteToRemove = await this.noteRepository.findOne({
        where: { id },
      });

      if (!noteToRemove) {
        this.logger.error(`Note with ID ${id} not found for deletion`);
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      await this.noteRepository.remove(noteToRemove);

      this.logger.log(`Note with ID ${id} successfully deleted`);

      return {
        message: `Note with ID ${id} has been successfully removed`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Failed to delete note', {
        error: error.message,
        id,
        stack: error.stack,
      });
      throw error;
    }
  }
}
