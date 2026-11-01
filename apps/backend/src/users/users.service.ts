import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, displayName: true, role: true, createdAt: true }
    });
  }

  updateMe(userId: string, data: { displayName?: string }) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }
}
