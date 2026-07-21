import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCollection } from './collections';
import { prisma } from '@/server/prisma';

vi.mock('@/server/prisma', () => ({
  prisma: {
    collection: {
      create: vi.fn(),
    },
  },
}));

describe('Collections DB Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCollection', () => {
    it('should create the collection for the authenticated user', async () => {
      const createdRow = {
        id: 'col-1',
        name: 'React Patterns',
        description: 'Reusable patterns',
        isFavorite: false,
        updatedAt: new Date(),
      };
      (prisma.collection.create as any).mockResolvedValue(createdRow);

      const result = await createCollection('user-123', {
        name: 'React Patterns',
        description: 'Reusable patterns',
      });

      expect(prisma.collection.create).toHaveBeenCalledWith({
        data: {
          name: 'React Patterns',
          description: 'Reusable patterns',
          userId: 'user-123',
        },
      });
      expect(result).toEqual({
        id: 'col-1',
        name: 'React Patterns',
        description: 'Reusable patterns',
        isFavorite: false,
        updatedAt: createdRow.updatedAt,
      });
    });
  });
});
