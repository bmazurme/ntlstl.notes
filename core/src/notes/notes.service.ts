import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

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
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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

      this.logger.debug('Note saved successfully', { noteId: id });

      const result = await this.noteRepository.findOne({
        where: { id },
        relations: { type: true },
      });

      await this.invalidateListCache();

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

    const key = `notes:page:${page}`;
    const cached = await this.cacheManager.get(key);
    if (cached) return cached;

    const take = 10;
    const skip = (page - 1) * take;

    this.logger.debug('Pagination parameters', { page, take, skip });

    try {
      const [results, total] = await this.noteRepository.findAndCount({
        relations: { type: true },
        order: { id: 'DESC' },
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

      const response = { data: results, total };
      await this.cacheManager.set(key, response);
      return response;
    } catch (error) {
      this.logger.error('Failed to fetch notes list', { error, page });
      throw error;
    }
  }

  async findAllByType(typeId: number, page: number) {
    this.logger.log('Fetching notes list by type', { typeId, page });

    const key = `notes:type:${typeId}:page:${page}`;
    const cached = await this.cacheManager.get(key);
    if (cached) return cached;

    const take = 10;
    const skip = (page - 1) * take;

    this.logger.debug('Pagination parameters', { page, take, skip });

    try {
      const [results, total] = await this.noteRepository.findAndCount({
        relations: { type: true },
        where: { type: { id: typeId } },
        order: { id: 'DESC' },
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

      const response = { data: results, total };
      await this.cacheManager.set(key, response);
      return response;
    } catch (error) {
      this.logger.error('Failed to fetch notes list by type', {
        error,
        typeId,
        page,
      });
      throw error;
    }
  }

  async findOne(id: number) {
    this.logger.log('Fetching note by ID', { id });

    const key = `notes:${id}`;
    const cached = await this.cacheManager.get<Note>(key);
    if (cached) return cached;

    try {
      const document = await this.noteRepository.findOne({
        where: { id },
        relations: { type: true },
        select: {
          id: true,
          title: true,
          preview: true,
          content: true,
          type: { id: true, name: true },
        },
      });

      if (!document) {
        this.logger.error('Not Found');
        throw new NotFoundException();
      }

      await this.cacheManager.set(key, document);
      return document;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('Failed to fetch note', { error, id });
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

      await Promise.all([
        this.cacheManager.del(`notes:${id}`),
        this.invalidateListCache(),
      ]);

      return result as Note;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('Failed to update note', { error, id });
      throw error;
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    this.logger.log('Deleting note', { id });

    try {
      const noteToRemove = await this.noteRepository.findOne({ where: { id } });

      if (!noteToRemove) {
        this.logger.error(`Note with ID ${id} not found for deletion`);
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      await this.noteRepository.remove(noteToRemove);

      await Promise.all([
        this.cacheManager.del(`notes:${id}`),
        this.invalidateListCache(),
      ]);

      this.logger.log(`Note with ID ${id} successfully deleted`);

      return { message: `Note with ID ${id} has been successfully removed` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('Failed to delete note', { error, id });
      throw error;
    }
  }

  private async invalidateListCache(): Promise<void> {
    const store = (this.cacheManager as any).store;
    if (typeof store?.keys !== 'function') return;

    const keys: string[] = await store.keys();
    const toDelete = keys.filter(
      (k: string) => k.startsWith('notes:page:') || k.startsWith('notes:type:'),
    );
    await Promise.all(toDelete.map((k: string) => this.cacheManager.del(k)));
  }
}
