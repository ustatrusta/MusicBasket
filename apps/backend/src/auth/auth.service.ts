import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';

type TokenPair = { accessToken: string; refreshToken: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto): Promise<TokenPair> {
    const passwordHash = await argon2.hash(dto.password, { type: argon2.argon2id });
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        displayName: dto.displayName,
        passwordHash
      }
    });

    return this.issueTokens(user.id, user.role);
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user.id, user.role);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: { revokedAt: null },
      orderBy: { createdAt: 'desc' }
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const isTokenValid = await argon2.verify(tokenRecord.tokenHash, refreshToken);
    if (!isTokenValid) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() }
    });

    const user = await this.prisma.user.findUnique({ where: { id: tokenRecord.userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.issueTokens(user.id, user.role);
  }

  async logout(refreshToken: string): Promise<{ success: true }> {
    const tokens = await this.prisma.refreshToken.findMany({ where: { revokedAt: null } });

    for (const token of tokens) {
      if (await argon2.verify(token.tokenHash, refreshToken)) {
        await this.prisma.refreshToken.update({ where: { id: token.id }, data: { revokedAt: new Date() } });
      }
    }

    return { success: true };
  }

  socialProvidersConfigured(): { google: boolean; apple: boolean } {
    return {
      google: !!this.configService.get<string>('GOOGLE_CLIENT_ID'),
      apple: !!this.configService.get<string>('APPLE_CLIENT_ID')
    };
  }

  private async issueTokens(userId: string, role: string): Promise<TokenPair> {
    const payload = { sub: userId, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TTL')
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TTL')
    });

    const hashedRefreshToken = await argon2.hash(refreshToken, { type: argon2.argon2id });

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      }
    });

    return { accessToken, refreshToken };
  }
}
