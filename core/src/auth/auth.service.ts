import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash, genSalt } from 'bcrypt';
import { Response, Request as CustomRequest, CookieOptions } from 'express';

import { CheckAuthResponseDto } from './dto/check-auth.response.dto';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

interface TokenPayload {
  userId: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly refreshJwtSecret: string;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private readonly saltRounds = 10;

  getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV !== 'dev' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: 'api/v1/auth',
      // path: this.configService.cookiePath,
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    const salt = await genSalt(this.saltRounds);
    const _hash = await hash(password, salt);
    console.log(_hash);

    if (user && (await compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(
    user: any,
    res: Response,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      this.logger.log(`User ${user.id} logged in`);
      const payload: TokenPayload = { userId: user.id };

      // Generate access token (short-lived)
      const accessToken = this.jwtService.sign(payload);

      // Generate refresh token (long-lived)
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.REFRESH_JWT_SECRET || 'refreshSecretKey',
        expiresIn: '7d', // Refresh token expires in 7 days
      });

      // Save refresh token to user
      await this.usersService.saveRefreshToken(user.id, refreshToken);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, this.getCookieOptions());

      return {
        accessToken,
        // refreshToken,
        expiresIn: 5, // 15 minutes in seconds
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error(`Login failed for user ${user.id}`, errorMessage);

      throw error;
    }
  }

  async refreshTokens(
    req: CustomRequest & { cookies?: { refreshToken?: string } },
    res: Response,
  ) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new Error('Refresh token not found in cookies');
      }

      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_JWT_SECRET || 'refreshSecretKey',
      });

      // Find user by refresh token
      const user = await this.usersService.findByRefreshToken(refreshToken);

      if (!user) {
        throw new Error('Invalid refresh token');
      }

      const newPayload = { userId: payload.userId };

      // Generate new access token
      const newAccessToken = this.jwtService.sign(newPayload);

      // Generate new refresh token
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.REFRESH_JWT_SECRET || 'refreshSecretKey',
        expiresIn: '7d',
      });

      // Update refresh token in database
      await this.usersService.saveRefreshToken(user.id, newRefreshToken);

      res.cookie('refreshToken', newRefreshToken, this.getCookieOptions());
      this.logger.log('Tokens refreshed successfully', {
        userId: payload.userId,
      });

      return {
        accessToken: newAccessToken,
        // refreshToken: newRefreshToken,
        expiresIn: 5,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error('RefreshTokens failed', errorMessage);

      throw new Error('Invalid refresh token');
    }
  }

  async logout(
    req: CustomRequest & { cookies?: { refreshToken?: string }; user: User },
    response: Response,
  ) {
    try {
      response.clearCookie('refreshToken', this.getCookieOptions());
      this.logger.log('User logged out', { userId: req.user?.id });

      return { message: 'Successfully logged out' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error('Logout failed', errorMessage);

      throw new HttpException(
        'Failed to logout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkAuth(
    request: CustomRequest & { cookies?: { refreshToken?: string } },
    response: Response,
  ): Promise<CheckAuthResponseDto> {
    try {
      const refreshToken = request.cookies.refreshToken;
      // Проверяем refresh token
      // const payload = this.verifyRefreshToken(refreshToken); -> guard
      const user = await this.usersService.findByRefreshToken(refreshToken);

      if (!user) {
        response.status(401);
        return { isAuthenticated: false };
      }

      const payload: TokenPayload = { userId: user.id };
      const accessToken = this.jwtService.sign(payload);

      response.status(200);

      return {
        accessToken,
        isAuthenticated: true,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : String(error);
      this.logger.error('CheckAuth failed', errorMessage);
      response.status(401);

      return { isAuthenticated: false };
    }
  }

  private verifyRefreshToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: process.env.REFRESH_JWT_SECRET || 'refreshSecretKey',
    });
  }

  private signAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  async generateNewTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      // roles: user.roles.map(({ name }) => name),
    };
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshJwtSecret,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
