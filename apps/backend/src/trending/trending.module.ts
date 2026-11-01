import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrendingController } from './trending.controller';
import { TrendingService } from './trending.service';

@Module({
  controllers: [TrendingController],
  providers: [TrendingService, PrismaService]
})
export class TrendingModule {}
