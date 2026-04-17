import { Injectable } from '@nestjs/common';

// import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      username: 'john',
      password: '$2b$10$oNa8UD6IULhrWTXodJ2ZTuiAoOYho0GC6WdCpElGLQCvHnxV72utS', // 'changeme'
      refreshToken: null,
    },
  ];

  async findByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  async findByRefreshToken(refreshToken: string) {
    return this.users.find((user) => user.refreshToken === refreshToken);
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    const user = this.users.find((u) => u.id === userId);

    if (user) {
      user.refreshToken = refreshToken;
    }
  }
}
