import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getItemsByType, getItemTypes } from './items';
import { prisma } from '@/server/prisma';

vi.mock('@/server/prisma', () => ({
  prisma: {
    item: {
      findMany: vi.fn(),
    },
    itemType: {
      findMany: vi.fn(),
    },
  },
}));

describe('Items DB Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getItemTypes', () => {
    it('should return system types and user types', async () => {
      const mockTypes = [
        { id: '1', name: 'Snippet', icon: 'code', color: 'blue', isSystem: true, _count: { items: 5 } },
        { id: '2', name: 'Custom', icon: 'tag', color: 'green', isSystem: false, _count: { items: 2 } },
      ];
      (prisma.itemType.findMany as any).mockResolvedValue(mockTypes);

      const result = await getItemTypes('user-123');
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Snippet');
    });

    it('should handle guest users by returning only system types', async () => {
      const mockTypes = [{ id: '1', name: 'Snippet', icon: 'code', color: 'blue', isSystem: true, _count: { items: 0 } }];
      (prisma.itemType.findMany as any).mockResolvedValue(mockTypes);

      const result = await getItemTypes('guest-id');
      expect(result).toHaveLength(1);
      expect(prisma.itemType.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([{ isSystem: true }])
        })
      }));
    });
  });

  describe('getItemsByType', () => {
    it('should return items of the specified type for a user', async () => {
      const mockItems = [
        {
          id: 'item-1',
          title: 'Test Item',
          description: 'Desc',
          userId: 'user-123',
          isFavorite: false,
          isPinned: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          type: { id: 'type-1', name: 'Snippet', icon: 'code', color: 'blue' },
          tags: [{ tag: { name: 'tag1' } }],
        },
      ];
      (prisma.item.findMany as any).mockResolvedValue(mockItems);

      const result = await getItemsByType('user-123', 'Snippet');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Item');
      expect(result[0].tags).toEqual(['tag1']);
    });

    it('should return empty array for guest users', async () => {
      const result = await getItemsByType('guest-id', 'Snippet');
      expect(result).toEqual([]);
      expect(prisma.item.findMany).not.toHaveBeenCalled();
    });
  });
});
