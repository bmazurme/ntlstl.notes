import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { OauthModule } from './oauth/oauth.module';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';
import { TypesModule } from './types/types.module';

import { TypeOrmModuleConfig } from './type-orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModuleConfig,
    AuthModule,
    OauthModule,
    UsersModule,
    NotesModule,
    TypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
