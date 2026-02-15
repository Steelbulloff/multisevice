import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostgreSQLConfigService {
  constructor(private configService: ConfigService) {
    // console.log('DB Host:', this.configService.get<string>('DATABASE_HOST'));
    // console.log('DB Port:', this.configService.get<number>('DATABASE_PORT'));
    // console.log(
    //   'DB User:',
    //   this.configService.get<string>('DATABASE_USERNAME'),
    // );
    // console.log(
    //   'DB Password:',
    //   this.configService.get<string>('DATABASE_PASSWORD'),
    // );
    // console.log('DB Name:', this.configService.get<string>('DATABASE_NAME'));
  }

  get host(): string {
    return this.configService.get<string>('db.host') ?? '';
  }

  get port(): number {
    return Number(this.configService.get<number>('db.port'));
  }

  get username(): string {
    return this.configService.get<string>('db.username') ?? '';
  }

  get password(): string {
    return this.configService.get<string>('db.password') ?? '';
  }

  get database(): string {
    return this.configService.get<string>('db.database') ?? '';
  }
}
