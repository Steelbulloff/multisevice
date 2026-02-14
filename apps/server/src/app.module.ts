import { Module } from '@nestjs/common';
import { ModelsModule } from './models/models.module';
import { CoreModule } from './core';

@Module({
  imports: [CoreModule, ModelsModule],
})
export class AppModule {}
