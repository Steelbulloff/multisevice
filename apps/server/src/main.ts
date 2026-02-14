import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AppConfigService } from './core/config/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig: AppConfigService = app.get(AppConfigService);

  // app.setGlobalPrefix('api');

  // Включение CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные методы
    credentials: true, // Если необходимо передавать куки
  });

  await app.listen(appConfig.port);
}
bootstrap()
  .then(() => Logger.log(`🚀 Application is running`))
  .catch((error) => Logger.log(`🚨 Application running error: ${error}`));
