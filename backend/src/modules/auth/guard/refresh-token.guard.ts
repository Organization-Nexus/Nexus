import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/modules/redis/redis.service';
import { UnauthorizedRefreshToken } from '../exception/auth.exception';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('올바른 인증 헤더가 없습니다');
    }

    const refreshToken = authHeader.split(' ')[1];

    try {
      // Refresh Token 검증
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Redis에서 저장된 토큰과 비교
      const storedToken = await this.redisService.get(`refresh:${payload.id}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedRefreshToken();
      }

      request.user = payload;
      request.refreshToken = refreshToken; // 필요한 경우를 위해 저장
      return true;
    } catch (error) {
      throw new UnauthorizedRefreshToken();
    }
  }
}
