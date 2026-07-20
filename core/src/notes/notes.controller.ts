import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { User } from '../users/entities/user.entity';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('api/v1/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @CurrentUser() user: User) {
    return this.notesService.create(createNoteDto, user);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.notesService.findBySlug(slug);
  }

  @Get('by-title/:title')
  findByTitle(@Param('title') title: string) {
    return this.notesService.findByTitle(title);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Get('pages/:page')
  findAll(@Param('page') page: string) {
    return this.notesService.findAll(+page);
  }
  @Get('type/:typeId/pages/:page')
  findAllByType(@Param('page') page: string, @Param('typeId') typeId: string) {
    return this.notesService.findAllByType(+typeId, +page);
  }

  @Get('tag/:slug/pages/:page')
  findAllByTag(@Param('page') page: string, @Param('slug') slug: string) {
    return this.notesService.findAllByTag(slug, +page);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
