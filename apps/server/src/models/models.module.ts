import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LinksModule } from './links/links.module';

@Module({
  imports: [AuthModule, LinksModule],
})
export class ModelsModule {}
