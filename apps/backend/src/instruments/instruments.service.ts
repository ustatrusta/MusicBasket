import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstrumentsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.instrument.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  }
}
