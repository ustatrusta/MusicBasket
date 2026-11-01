import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  listActive() {
    return this.prisma.musicGenre.findMany({ where: { isActive: true }, orderBy: [{ order: 'asc' }, { name: 'asc' }] });
  }

  create(data: { name: string; slug: string; code: string }) {
    return this.prisma.musicGenre.create({ data });
  }

  update(id: string, data: Partial<{ name: string; slug: string; code: string; isActive: boolean }>) {
    return this.prisma.musicGenre.update({ where: { id }, data });
  }

  archive(id: string) {
    return this.prisma.musicGenre.update({ where: { id }, data: { isActive: false } });
  }
}
