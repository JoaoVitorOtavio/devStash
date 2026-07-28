import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCollection, getAllCollectionsWithStats, getAllCollectionsForSearch, getFavoriteCollections, getCollectionWithItems, updateCollection, deleteCollection } from './collections';
import { prisma } from '@/server/prisma';

vi.mock('@/server/prisma', () => ({
  prisma: {
    collection: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
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
      (prisma.collection.count as any).mockResolvedValue(1);

      const result = await getAllCollectionsWithStats('user-123');

      expect(result.collections).toEqual([{
        id: 'col-1',
        name: 'React Patterns',
        description: 'Reusable patterns',
        isFavorite: true,
        itemCount: 2,
        types: [{ id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6', count: 2 }],
        primaryColor: '#3b82f6',
        updatedAt,
      }]);
      expect(result.totalCount).toBe(1);
    });

    it('should fetch only the requested page slice', async () => {
      (prisma.collection.findMany as any).mockResolvedValue([]);
      (prisma.collection.count as any).mockResolvedValue(50);

      await getAllCollectionsWithStats('user-123', 3);

      expect(prisma.collection.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 42,
        take: 21,
      }));
    });

    it('should return an empty array for guest users without querying the database', async () => {
      const result = await getAllCollectionsWithStats('guest-id');
      expect(result).toEqual({ collections: [], totalCount: 0 });
      expect(prisma.collection.findMany).not.toHaveBeenCalled();
    });
  });

  describe('getFavoriteCollections', () => {
    it('should return favorited collections with type breakdown, sorted by most recently updated', async () => {
      const updatedAt = new Date();
      (prisma.collection.findMany as any).mockResolvedValue([
        {
          id: 'col-1',
          name: 'React Patterns',
          description: null,
          isFavorite: true,
          updatedAt,
          _count: { items: 2 },
          items: [
            { item: { type: { id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6' } } },
            { item: { type: { id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6' } } },
          ],
        },
      ]);

      const result = await getFavoriteCollections('user-123');

      expect(prisma.collection.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId: 'user-123', isFavorite: true },
        orderBy: { updatedAt: 'desc' },
      }));
      expect(result).toEqual([{
        id: 'col-1',
        name: 'React Patterns',
        description: null,
        isFavorite: true,
        itemCount: 2,
        types: [{ id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6', count: 2 }],
        primaryColor: '#3b82f6',
        updatedAt,
      }]);
    });

    it('should return an empty array for guest users without querying the database', async () => {
      const result = await getFavoriteCollections('guest-id');
      expect(result).toEqual([]);
      expect(prisma.collection.findMany).not.toHaveBeenCalled();
    });
  });

  describe('getAllCollectionsForSearch', () => {
    it('should return a lightweight shape for every collection, unpaginated', async () => {
      (prisma.collection.findMany as any).mockResolvedValue([
        { id: 'col-1', name: 'React Patterns', _count: { items: 3 } },
      ]);

      const result = await getAllCollectionsForSearch('user-123');

      expect(result).toEqual([{ id: 'col-1', name: 'React Patterns', itemCount: 3 }]);
      expect(prisma.collection.findMany).toHaveBeenCalledWith(expect.not.objectContaining({
        skip: expect.anything(),
        take: expect.anything(),
      }));
    });

    it('should return an empty array for guest users without querying the database', async () => {
      const result = await getAllCollectionsForSearch('guest-id');
      expect(result).toEqual([]);
      expect(prisma.collection.findMany).not.toHaveBeenCalled();
    });
  });

  describe('getCollectionWithItems', () => {
    it('should return the collection with its paginated items for the owning user', async () => {
      (prisma.collection.findUnique as any).mockResolvedValue({
        id: 'col-1',
        name: 'React Patterns',
        description: 'Reusable patterns',
        isFavorite: true,
        _count: { items: 1 },
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
      expect(result?.totalItemCount).toBe(1);
      expect(result?.items).toHaveLength(1);
      expect(result?.items[0].title).toBe('Debounce Hook');
      expect(result?.items[0].tags).toEqual(['react']);
    });

    it('should fetch only the requested page slice of items', async () => {
      (prisma.collection.findUnique as any).mockResolvedValue({
        id: 'col-1',
        name: 'React Patterns',
        description: null,
        isFavorite: false,
        _count: { items: 50 },
        items: [],
      });

      await getCollectionWithItems('user-123', 'col-1', 3);

      expect(prisma.collection.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        include: expect.objectContaining({
          items: expect.objectContaining({ skip: 42, take: 21 }),
        }),
      }));
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

  describe('updateCollection', () => {
    it('should update the collection when owned by the user', async () => {
      (prisma.collection.findUnique as any).mockResolvedValue({ id: 'col-1', userId: 'user-123' });
      const updatedRow = {
        id: 'col-1',
        name: 'Renamed',
        description: 'New description',
        isFavorite: false,
        updatedAt: new Date(),
      };
      (prisma.collection.update as any).mockResolvedValue(updatedRow);

      const result = await updateCollection('user-123', 'col-1', {
        name: 'Renamed',
        description: 'New description',
      });

      expect(prisma.collection.findUnique).toHaveBeenCalledWith({ where: { id: 'col-1', userId: 'user-123' } });
      expect(prisma.collection.update).toHaveBeenCalledWith({
        where: { id: 'col-1' },
        data: { name: 'Renamed', description: 'New description' },
      });
      expect(result).toEqual({
        id: 'col-1',
        name: 'Renamed',
        description: 'New description',
        isFavorite: false,
        updatedAt: updatedRow.updatedAt,
      });
    });

    it('should return null when the collection is not owned by the user', async () => {
      (prisma.collection.findUnique as any).mockResolvedValue(null);

      const result = await updateCollection('user-123', 'missing-id', { name: 'Renamed', description: null });

      expect(result).toBeNull();
      expect(prisma.collection.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteCollection', () => {
    it('should delete the collection when owned by the user', async () => {
      (prisma.collection.findUnique as any).mockResolvedValue({ id: 'col-1', userId: 'user-123' });
      (prisma.collection.delete as any).mockResolvedValue({ id: 'col-1' });

      const result = await deleteCollection('user-123', 'col-1');

      expect(prisma.collection.findUnique).toHaveBeenCalledWith({ where: { id: 'col-1', userId: 'user-123' } });
      expect(prisma.collection.delete).toHaveBeenCalledWith({ where: { id: 'col-1' } });
      expect(result).toBe(true);
    });

    it('should return false when the collection is not owned by the user', async () => {
      (prisma.collection.findUnique as any).mockResolvedValue(null);

      const result = await deleteCollection('user-123', 'missing-id');

      expect(result).toBe(false);
      expect(prisma.collection.delete).not.toHaveBeenCalled();
    });
  });
});
