import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class JWTConfigService {
  constructor(private configService: ConfigService) {}

  get global(): boolean {
    return this.configService.get<boolean>('jwt.global') ?? false;
  }

  get secret(): string {
    return this.configService.getOrThrow<string>('jwt.secret');
  }
  get refresh_secret(): string {
    return this.configService.getOrThrow<string>('jwt.refresh_secret');
  }

  get signOptions(): JwtSignOptions {
    return this.configService.get<JwtSignOptions>('jwt.signOptions') ?? {};
  }
}
