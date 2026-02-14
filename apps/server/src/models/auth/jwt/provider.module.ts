import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfigModule, JWTConfigService } from 'src/core/config/auth';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [JWTConfigModule],
      inject: [JWTConfigService],
      useFactory: (config: JWTConfigService) => ({
        secret: config.secret,
        refresh_secret: config.refresh_secret,
        signOptions: config.signOptions,
      }),
      global: true,
    }),
  ],
  exports: [JwtModule],
})
export class JWTProviderModule {}
