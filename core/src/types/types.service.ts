import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Type } from './entities/type.entity';

import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

import {
  // createRequestCounter,
  createRequestDurationHistogram,
} from '../metrics/metrics.provider';

@Injectable()
export class TypesService {
  private readonly logger = new Logger(TypesService.name);

  private typesFindDuration = createRequestDurationHistogram(
    'types_find_duration_seconds',
    'Duration of types find operations in seconds',
  );

  constructor(
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
  ) {}

  async create(createTypeDto: CreateTypeDto) {
    const type = new Type();
    type.name = createTypeDto.name;

    const { id } = await this.typeRepository.save(type);
    return this.typeRepository.findOne({
      where: { id },
    });
  }

  async findAll() {
    return this.typeRepository.find();
  }

  async findOne(id: number) {
    return this.typeRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateTypeDto: UpdateTypeDto) {
    const end = this.typesFindDuration.startTimer({ operation: 'update' });

    try {
      const existingType = await this.typeRepository.findOneOrFail({
        where: { id },
      });
      const updatedType = { ...existingType, ...updateTypeDto };

      await this.typeRepository.save(updatedType);
      this.logger.log(`Type updated - id: ${id}`);

      return updatedType;
    } catch (error) {
      this.logger.error(`Update type error - id: ${id}`, error);
      throw error;
    } finally {
      end();
    }
  }

  async remove(id: number) {
    const end = this.typesFindDuration.startTimer({ operation: 'remove' });

    try {
      const type = await this.typeRepository.findOneBy({ id });

      if (!type) {
        throw new BadRequestException(`Type with id ${id} not found`);
      }

      await this.typeRepository.remove(type);
      this.logger.log(`Type removed - id: ${id}`);

      return { message: 'Type successfully removed' };
    } catch (error) {
      this.logger.error(`Remove type error - id: ${id}`, error);

      throw error;
    } finally {
      end();
    }
  }
}
