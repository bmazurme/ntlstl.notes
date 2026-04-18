import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      return false;
    }

    try {
      // Здесь логика проверки токена (JWT, БД и т. д.)
      // const isValid = this.validateRefreshToken(refreshToken);
      // return isValid;

      return true;
    } catch (error) {
      return false;
    }
  }

  private validateRefreshToken(
    token: string,
  ): Promise<{ userId: number; iat: number; expiresIn: number }> {
    return this.jwtService.verify(token, {
      secret: process.env.REFRESH_JWT_SECRET || 'refreshSecretKey',
    });
    // Реализация проверки токена:
    // - декодирование JWT;
    // - проверка подписи;
    // - валидация срока действия;
    // - поиск в БД (если нужно).
    // Возвращает true, если токен валиден.
    // return true; // Замените на реальную логику
  }
}
