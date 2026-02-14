import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PostgreSQLConfigModule,
  PostgreSQLConfigService,
} from 'src/core/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgreSQLConfigModule],
      inject: [PostgreSQLConfigService],
      useFactory: (configService: PostgreSQLConfigService) => ({
        type: 'postgres',
        host: configService.host,
        port: configService.port,
        username: configService.username,
        password: configService.password,
        database: configService.database,
        entities: [__dirname + '/**/*.entity.ts'],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class PostgreSQLProviderModule {}
