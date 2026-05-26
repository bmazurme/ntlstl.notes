import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { Type } from './entities/type.entity';

@Module({
  imports: [TypesModule, TypeOrmModule.forFeature([Type])],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}
