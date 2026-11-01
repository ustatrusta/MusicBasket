import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy {
  readonly enabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.enabled = Boolean(
      this.configService.get<string>('GOOGLE_CLIENT_ID') && this.configService.get<string>('GOOGLE_CLIENT_SECRET')
    );

    if (!this.enabled) {
      Logger.warn('Google OAuth strategy disabled: missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET', 'GoogleStrategy');
    }
  }
}
