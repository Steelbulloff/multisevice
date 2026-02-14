import { registerAs } from '@nestjs/config';

export const configuration = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  refresh_secret: process.env.JWT_REFRESH_SECRET,
  signOptions: {
    expiresIn: '15m',
  },
}));
