import { Module } from '@nestjs/common';
import { ModelsModule } from './models/models.module';
import { CoreModule } from './core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/server/.env.development', // Указываем путь один раз здесь
    }),
    CoreModule,
    ModelsModule,
  ],
})
export class AppModule {}
