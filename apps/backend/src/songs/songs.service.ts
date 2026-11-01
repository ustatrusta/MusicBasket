import { Injectable } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildPaginationMeta, resolvePagination } from '../common/pagination/pagination';

interface ListSongsQuery {
  page?: number;
  limit?: number;
  q?: string;
  sort?: 'newest' | 'views' | 'alphabetical';
  includeAllStatuses?: boolean;
}

@Injectable()
export class SongsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(query: ListSongsQuery) {
    const { page, limit, skip, take } = resolvePagination(query);

    const where = {
      deletedAt: null,
      status: query.includeAllStatuses ? undefined : ContentStatus.PUBLISHED,
      title: query.q ? { contains: query.q, mode: 'insensitive' as const } : undefined
    };

    const [data, total] = await Promise.all([
      this.prisma.song.findMany({
        where,
        skip,
        take,
        orderBy: query.sort === 'alphabetical' ? { title: 'asc' } : { createdAt: 'desc' }
      }),
      this.prisma.song.count({ where })
    ]);

    return {
      data,
      meta: buildPaginationMeta(page, limit, total)
    };
  }

  detail(id: string) {
    return this.prisma.song.findFirst({
      where: { id, deletedAt: null, status: ContentStatus.PUBLISHED },
      include: {
        metadataEntries: true,
        artists: { include: { artist: true } },
        composers: { include: { composer: true } }
      }
    });
  }

  adminCreate(data: { title: string; slug: string; genreId: string }) {
    return this.prisma.song.create({ data: { ...data, searchKey: data.title.toLocaleLowerCase('tr-TR') } });
  }

  adminUpdate(id: string, data: Partial<{ title: string; slug: string; genreId: string }>) {
    return this.prisma.song.update({ where: { id }, data });
  }

  adminUpdateStatus(id: string, status: ContentStatus) {
    return this.prisma.song.update({ where: { id }, data: { status } });
  }
}
