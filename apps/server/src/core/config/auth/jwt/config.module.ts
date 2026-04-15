import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTConfigService } from './config.service';
import { configuration } from './configuration';

@Module({
  imports: [
    // Используем forFeature вместо forRoot!
    ConfigModule.forFeature(configuration),
  ],
  providers: [JWTConfigService],
  exports: [JWTConfigService],
})
export class JWTConfigModule {}
