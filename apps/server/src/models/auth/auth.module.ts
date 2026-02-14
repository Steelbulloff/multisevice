import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import {
  AuthorizationController,
  RefreshTokenController,
  RegistrationController,
} from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from './entities';
import { JWTConfigModule } from 'src/core/config/auth';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JWTConfigModule], // Убедитесь, что репозитории указаны здесь
  providers: [AuthService, JwtStrategy],
  controllers: [
    RegistrationController,
    AuthorizationController,
    RefreshTokenController,
  ],
})
export class AuthModule {}
