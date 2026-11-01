import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CACHE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService): { enabled: boolean; url: string | null } => {
        const redisUrl = configService.get<string>('REDIS_URL');

        if (!redisUrl) {
          Logger.warn('REDIS_URL is not configured. Falling back to in-memory/no-op cache.', 'RedisCacheModule');
          return { enabled: false, url: null };
        }

        return { enabled: true, url: redisUrl };
      }
    }
  ],
  exports: ['REDIS_CACHE']
})
export class RedisCacheModule {}
