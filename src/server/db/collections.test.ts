import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCollection, getAllCollectionsWithStats, getCollectionWithItems } from './collections';
import { prisma } from '@/server/prisma';

vi.mock('@/server/prisma', () => ({
  prisma: {
    collection: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
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

  describe('getAllCollectionsWithStats', () => {
    it('should return collections with item type breakdown for the authenticated user', async () => {
      const updatedAt = new Date();
      (prisma.collection.findMany as any).mockResolvedValue([
        {
          id: 'col-1',
          name: 'React Patterns',
          description: 'Reusable patterns',
          isFavorite: true,
          updatedAt,
          _count: { items: 2 },
          items: [
            { item: { type: { id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6' } } },
            { item: { type: { id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6' } } },
          ],
        },
      ]);

      const result = await getAllCollectionsWithStats('user-123');

      expect(result).toEqual([{
        id: 'col-1',
        name: 'React Patterns',
        description: 'Reusable patterns',
        isFavorite: true,
        itemCount: 2,
        types: [{ id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6', count: 2 }],
        primaryColor: '#3b82f6',
        updatedAt,
      }]);
    });

    it('should return an empty array for guest users without querying the database', async () => {
      const result = await getAllCollectionsWithStats('guest-id');
      expect(result).toEqual([]);
      expect(prisma.collection.findMany).not.toHaveBeenCalled();
    });
  });

  describe('getCollectionWithItems', () => {
    it('should return the collection with its items for the owning user', async () => {
      (prisma.collection.findUnique as any).mockResolvedValue({
        id: 'col-1',
        name: 'React Patterns',
        description: 'Reusable patterns',
        isFavorite: true,
        items: [
          {
            item: {
              id: 'item-1',
              title: 'Debounce Hook',
              description: 'A hook',
              content: 'code',
              url: null,
              isFavorite: false,
              isPinned: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              type: { id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6' },
              tags: [{ tag: { name: 'react' } }],
            },
          },
        ],
      });

      const result = await getCollectionWithItems('user-123', 'col-1');

      expect(prisma.collection.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'col-1', userId: 'user-123' },
      }));
      expect(result?.name).toBe('React Patterns');
      expect(result?.items).toHaveLength(1);
      expect(result?.items[0].title).toBe('Debounce Hook');
      expect(result?.items[0].tags).toEqual(['react']);
    });

    it('should return null when the collection does not exist or is not owned by the user', async () => {
      (prisma.collection.findUnique as any).mockResolvedValue(null);

      const result = await getCollectionWithItems('user-123', 'missing-id');
      expect(result).toBeNull();
    });

    it('should return null for guest users without querying the database', async () => {
      const result = await getCollectionWithItems('guest-id', 'col-1');
      expect(result).toBeNull();
      expect(prisma.collection.findUnique).not.toHaveBeenCalled();
    });
  });
});
