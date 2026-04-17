import {
  Controller,
  Post,
  Request,
  UseGuards,
  // Body,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request as CustomRequest } from 'express';

import { AuthService } from './auth.service';

// interface CustomRequest extends Request {
//   cookies?: {
//     [key: string]: string;
//   };
// }

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Request() req: Request & { user: any },
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(req.user, response);
  }

  @Post('refresh')
  async refreshToken(
    // @Body() body: { refreshToken: string },
    @Request() req: CustomRequest & { cookies?: { refreshToken?: string } },
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshTokens(
      // body.refreshToken,
      req,
      response,
    );
  }
}
