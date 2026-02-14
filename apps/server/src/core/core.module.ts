import { Module } from '@nestjs/common';
import { AppConfigModule, PostgreSQLConfigModule } from './config';
import { PostgreSQLProviderModule } from './providers';
import { JWTConfigModule } from './config/auth';
import { JWTProviderModule } from 'src/models/auth/jwt';

@Module({
  imports: [
    AppConfigModule,
    PostgreSQLConfigModule,
    PostgreSQLProviderModule,
    JWTConfigModule,
    JWTProviderModule,
  ],
  exports: [PostgreSQLProviderModule, JWTProviderModule],
})
export class CoreModule {}
