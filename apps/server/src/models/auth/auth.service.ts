import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JWTConfigService } from 'src/core/config/auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private jwtConfig: JWTConfigService,
  ) {}

  async registration(newUser: User) {
    console.log(newUser);
    const exist = await this.userRepository.findOneBy({
      login: newUser.login,
    });

    if (exist) {
      throw new HttpException('Already exist', 400);
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const user = await this.userRepository.save({
      ...newUser,
      password: hashedPassword,
    });

    const payload = { sub: user.id, username: user.login };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async authorization(authUser: User) {
    const user = await this.userRepository.findOneBy({
      login: authUser.login,
    });

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(authUser.password, user.password);
    if (!isMatch) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfig.refresh_secret,
      });

      const user = await this.userRepository.findOneBy({
        id: payload.sub,
      });

      if (!user || !user.refreshToken) throw new UnauthorizedException();

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isMatch) throw new UnauthorizedException();

      const tokens = await this.generateTokens(user);

      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateTokens(user: User) {
    const payload = { sub: user.id, username: user.login };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.secret,
      expiresIn: '15m',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refresh_secret,
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);

    await this.userRepository.update(userId, {
      refreshToken: hashed,
    });
  }
}
