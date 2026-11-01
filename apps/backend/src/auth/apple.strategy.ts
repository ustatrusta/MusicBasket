import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppleStrategy {
  readonly enabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.enabled = Boolean(this.configService.get<string>('APPLE_CLIENT_ID'));
    if (!this.enabled) {
      Logger.warn('Apple OAuth strategy disabled: missing APPLE_CLIENT_ID', 'AppleStrategy');
    }
  }
}
