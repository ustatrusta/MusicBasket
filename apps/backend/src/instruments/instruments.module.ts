import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InstrumentsController } from './instruments.controller';
import { InstrumentsService } from './instruments.service';

@Module({
  controllers: [InstrumentsController],
  providers: [InstrumentsService, PrismaService]
})
export class InstrumentsModule {}
