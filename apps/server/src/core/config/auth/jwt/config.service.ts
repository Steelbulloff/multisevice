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
    // Попробуйте сначала получить просто из процесса, чтобы понять, загрузился ли .env
    const fromEnv = process.env.JWT_SECRET;
    const fromConfig = this.configService.get<string>('jwt.secret');

    console.log('DEBUG: process.env.JWT_SECRET =', fromEnv);
    console.log('DEBUG: configService.get =', fromConfig);

    return fromConfig || fromEnv || ''; // Временный хак для проверки
  }
  get refresh_secret(): string {
    return this.configService.getOrThrow<string>('jwt.refresh_secret');
  }

  get signOptions(): JwtSignOptions {
    return this.configService.get<JwtSignOptions>('jwt.signOptions') ?? {};
  }
}
