import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';

@Module({
  controllers: [GenresController],
  providers: [GenresService, PrismaService]
})
export class GenresModule {}
