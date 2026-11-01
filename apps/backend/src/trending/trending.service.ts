import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrendingService {
  constructor(private readonly prisma: PrismaService) {}

  async listSongs(limit = 10) {
    return this.prisma.trendingScore.findMany({
      take: Math.min(Math.max(limit, 1), 50),
      orderBy: [{ periodStart: 'desc' }, { score: 'desc' }],
      include: { song: true }
    });
  }
}
