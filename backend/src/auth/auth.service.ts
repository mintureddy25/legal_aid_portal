import { Injectable, OnModuleInit, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /** Seed the single admin/lawyer account from env on first boot. */
  async onModuleInit() {
    const username = this.config.get<string>('ADMIN_USERNAME');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (!username || !password) return;
    const existing = await this.prisma.adminUser.findUnique({ where: { username } });
    if (!existing) {
      await this.prisma.adminUser.create({
        data: {
          username,
          passwordHash: await bcrypt.hash(password, 10),
          displayName: 'Portal Owner',
        },
      });
      this.logger.log(`Seeded admin user "${username}"`);
    }
  }

  async login(username: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const token = await this.jwt.signAsync({ sub: user.id, username: user.username });
    return { token, user: { id: user.id, username: user.username, displayName: user.displayName } };
  }
}
