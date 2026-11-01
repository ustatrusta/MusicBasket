import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, RegisterDto, SocialAuthDto } from './dto';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Post('google')
  google(@Body() dto: SocialAuthDto) {
    const cfg = this.authService.socialProvidersConfigured();
    if (!cfg.google) {
      throw new UnauthorizedException('Google auth provider is not configured');
    }

    return { message: 'Google auth token received', idTokenLength: dto.idToken.length };
  }

  @Post('apple')
  apple(@Body() dto: SocialAuthDto) {
    const cfg = this.authService.socialProvidersConfigured();
    if (!cfg.apple) {
      throw new UnauthorizedException('Apple auth provider is not configured');
    }

    return { message: 'Apple auth token received', idTokenLength: dto.idToken.length };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: { user: unknown }) {
    return req.user;
  }
}
