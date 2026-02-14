import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entities/auth.entity';
import { Public } from 'src/core';

@Public()
@Controller('auth/registration')
export class RegistrationController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  registration(@Body() NewUser: User) {
    return this.authService.registration(NewUser);
  }
}

@Public()
@Controller('auth/login')
export class AuthorizationController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  authorization(@Body() AuthUser: User) {
    return this.authService.authorization(AuthUser);
  }
}

@Controller('auth/refresh')
export class RefreshTokenController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refresh(body.refresh_token);
  }
}
