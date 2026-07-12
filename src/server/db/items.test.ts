import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getItemsByType, getItemTypes, getItemById } from './items';
import { prisma } from '@/server/prisma';

vi.mock('@/server/prisma', () => ({
  prisma: {
    item: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
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

  describe('getItemById', () => {
    it('should return full item detail for the owning user', async () => {
      const mockItem = {
        id: 'item-1',
        title: 'Test Item',
        description: 'Desc',
        contentType: 'text',
        content: 'console.log("hi")',
        fileUrl: null,
        fileName: null,
        fileSize: null,
        url: null,
        language: 'javascript',
        userId: 'user-123',
        isFavorite: false,
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: { id: 'type-1', name: 'Snippet', icon: 'code', color: 'blue' },
        collection: { id: 'col-1', name: 'React Patterns' },
        tags: [{ tag: { name: 'tag1' } }],
      };
      (prisma.item.findUnique as any).mockResolvedValue(mockItem);

      const result = await getItemById('user-123', 'item-1');
      expect(result?.title).toBe('Test Item');
      expect(result?.tags).toEqual(['tag1']);
      expect(result?.collection).toEqual({ id: 'col-1', name: 'React Patterns' });
    });

    it('should return null when the item does not exist', async () => {
      (prisma.item.findUnique as any).mockResolvedValue(null);

      const result = await getItemById('user-123', 'missing-id');
      expect(result).toBeNull();
    });

    it('should return null for guest users without querying the database', async () => {
      const result = await getItemById('guest-id', 'item-1');
      expect(result).toBeNull();
      expect(prisma.item.findUnique).not.toHaveBeenCalled();
    });
  });
});
