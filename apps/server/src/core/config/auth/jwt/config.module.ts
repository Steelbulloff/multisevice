import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTConfigService } from './config.service';
import { configuration } from './configuration';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true })],
  providers: [JWTConfigService],
  exports: [JWTConfigService],
})
export class JWTConfigModule {}
