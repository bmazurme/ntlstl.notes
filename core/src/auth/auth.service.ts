import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash, genSalt } from 'bcrypt';
import { Response, Request as CustomRequest } from 'express';

import { UsersService } from '../users/users.service';

interface TokenPayload {
  userId: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private readonly saltRounds = 10;

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
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      // sameSite: 'strict', // Prevent CSRF
      sameSite: process.env.NODE_ENV !== 'dev' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: '/auth/refresh', // Only accessible for refresh endpoint
    });

    return {
      accessToken,
      // refreshToken,
      expiresIn: 5, // 15 minutes in seconds
    };
  }

  async refreshTokens(
    // refreshToken: string,
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
      // console.log(payload);

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

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        // sameSite: 'strict', // Prevent CSRF
        sameSite: process.env.NODE_ENV !== 'dev' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        path: '/auth/refresh', // Only accessible for refresh endpoint
      });

      return {
        accessToken: newAccessToken,
        // refreshToken: newRefreshToken,
        expiresIn: 5,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
