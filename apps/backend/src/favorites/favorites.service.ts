import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.userFavorite.findMany({ where: { userId }, include: { song: true } });
  }

  add(userId: string, songId: string) {
    return this.prisma.userFavorite.upsert({
      where: { songId_userId: { songId, userId } },
      update: {},
      create: { userId, songId }
    });
  }

  remove(userId: string, songId: string) {
    return this.prisma.userFavorite.delete({ where: { songId_userId: { songId, userId } } });
  }
}
