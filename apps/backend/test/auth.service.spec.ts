import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../src/auth/auth.service';

const mockPrisma = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn()
  },
  refreshToken: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn()
  }
};

const mockJwt = {
  signAsync: vi.fn()
};

const mockConfig = {
  get: vi.fn((key: string) => {
    const values: Record<string, string> = {
      JWT_ACCESS_TTL: '15m',
      JWT_REFRESH_TTL: '30d'
    };
    return values[key];
  }),
  getOrThrow: vi.fn((key: string) => {
    const values: Record<string, string> = {
      JWT_ACCESS_SECRET: 'access',
      JWT_REFRESH_SECRET: 'refresh'
    };
    return values[key];
  })
};

describe('AuthService token rotation', () => {
  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockJwt.signAsync.mockResolvedValueOnce('access-token').mockResolvedValueOnce('refresh-token');
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', role: 'USER' });
    service = new AuthService(mockPrisma as never, mockJwt as never, mockConfig as never);
  });

  it('rotates refresh token and revokes previous one', async () => {
    const oldToken = 'old-refresh-token';
    const argon2 = await import('argon2');
    const oldHash = await argon2.hash(oldToken);

    mockPrisma.refreshToken.findFirst.mockResolvedValue({
      id: 'rt1',
      userId: 'u1',
      tokenHash: oldHash,
      revokedAt: null
    });

    const result = await service.refresh(oldToken);

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith({
      where: { id: 'rt1' },
      data: { revokedAt: expect.any(Date) }
    });
    expect(mockPrisma.refreshToken.create).toHaveBeenCalledTimes(1);
  });
});
