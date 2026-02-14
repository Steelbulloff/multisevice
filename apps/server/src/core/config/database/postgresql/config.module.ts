import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './configuration';
import { PostgreSQLConfigService } from './config.service';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] })],
  providers: [ConfigService, PostgreSQLConfigService],
  exports: [ConfigService, PostgreSQLConfigService],
})
export class PostgreSQLConfigModule {}
