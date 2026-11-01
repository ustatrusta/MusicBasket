import { describe, expect, it, vi } from 'vitest';
import { ContentStatus } from '@prisma/client';
import { SongsService } from '../src/songs/songs.service';

const prisma = {
  song: {
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0)
  }
};

describe('SongsService public listing', () => {
  it('filters by published status for public listing', async () => {
    const service = new SongsService(prisma as never);
    await service.listPublic({ page: 1, limit: 10 });

    expect(prisma.song.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: ContentStatus.PUBLISHED })
      })
    );
  });
});
