import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleStrategy } from './google.strategy';
import { AppleStrategy } from './apple.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET', 'phase1-dev-secret')
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, GoogleStrategy, AppleStrategy],
  exports: [AuthService]
})
export class AuthModule {}
