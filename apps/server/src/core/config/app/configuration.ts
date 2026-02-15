import { registerAs } from '@nestjs/config';

export const configuration = registerAs('app', () => ({
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  url: process.env.SERVER_URL,
  port: process.env.APP_PORT,
}));
