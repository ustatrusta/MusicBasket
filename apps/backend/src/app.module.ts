import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { validateEnv } from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GenresModule } from './genres/genres.module';
import { SongsModule } from './songs/songs.module';
import { HealthModule } from './health/health.module';
import { RedisCacheModule } from './cache/redis-cache.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { TrendingModule } from './trending/trending.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120
      }
    ]),
    RedisCacheModule,
    AuthModule,
    UsersModule,
    GenresModule,
    SongsModule,
    InstrumentsModule,
    TrendingModule,
    FavoritesModule,
    HealthModule
  ]
})
export class AppModule {}
