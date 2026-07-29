import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getItemsByType, getItemTypes, getItemById, updateItem, deleteItem, createItem, getAllItemsForSearch, getFavoriteItems, getRecentItems } from './items';
import { prisma } from '@/server/prisma';

vi.mock('@/server/prisma', () => {
  const prismaMock = {
    item: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    itemType: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    collection: {
      findMany: vi.fn(),
    },
    tag: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    itemTag: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    itemCollection: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => callback(prismaMock)),
  };

  return { prisma: prismaMock };
});

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

  describe('getAllItemsForSearch', () => {
    it('should return all items with a truncated content preview', async () => {
      const mockItems = [
        {
          id: 'item-1',
          title: 'Debounce Hook',
          description: 'A hook',
          content: 'x'.repeat(150),
          type: { id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6' },
        },
        {
          id: 'item-2',
          title: 'Note without content',
          description: 'Fallback description',
          content: null,
          type: { id: 'type-2', name: 'Note', icon: 'FileText', color: '#f59e0b' },
        },
      ];
      (prisma.item.findMany as any).mockResolvedValue(mockItems);

      const result = await getAllItemsForSearch('user-123');

      expect(prisma.item.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId: 'user-123' },
      }));
      expect(result).toEqual([
        {
          id: 'item-1',
          title: 'Debounce Hook',
          contentPreview: 'x'.repeat(100),
          type: { id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6' },
        },
        {
          id: 'item-2',
          title: 'Note without content',
          contentPreview: 'Fallback description',
          type: { id: 'type-2', name: 'Note', icon: 'FileText', color: '#f59e0b' },
        },
      ]);
    });

    it('should return an empty array for guest users without querying the database', async () => {
      const result = await getAllItemsForSearch('guest-id');
      expect(result).toEqual([]);
      expect(prisma.item.findMany).not.toHaveBeenCalled();
    });
  });

  describe('getFavoriteItems', () => {
    it('should return favorited items sorted by most recently updated', async () => {
      const updatedAt = new Date();
      (prisma.item.findMany as any).mockResolvedValue([
        {
          id: 'item-1',
          title: 'Debounce Hook',
          updatedAt,
          type: { id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6' },
        },
      ]);

      const result = await getFavoriteItems('user-123');

      expect(prisma.item.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId: 'user-123', isFavorite: true },
        orderBy: { updatedAt: 'desc' },
      }));
      expect(result).toEqual([{
        id: 'item-1',
        title: 'Debounce Hook',
        type: { id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6' },
        updatedAt,
      }]);
    });

    it('should return an empty array for guest users without querying the database', async () => {
      const result = await getFavoriteItems('guest-id');
      expect(result).toEqual([]);
      expect(prisma.item.findMany).not.toHaveBeenCalled();
    });
  });

  describe('getRecentItems', () => {
    it('should sort pinned items before recently created ones', async () => {
      (prisma.item.findMany as any).mockResolvedValue([]);

      await getRecentItems('user-123');

      expect(prisma.item.findMany).toHaveBeenCalledWith(expect.objectContaining({
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      }));
    });

    it('should return an empty array for guest users without querying the database', async () => {
      const result = await getRecentItems('guest-id');
      expect(result).toEqual([]);
      expect(prisma.item.findMany).not.toHaveBeenCalled();
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
      (prisma.item.count as any).mockResolvedValue(1);

      const result = await getItemsByType('user-123', 'Snippet');
      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toBe('Test Item');
      expect(result.items[0].tags).toEqual(['tag1']);
      expect(result.totalCount).toBe(1);
    });

    it('should fetch only the requested page slice', async () => {
      (prisma.item.findMany as any).mockResolvedValue([]);
      (prisma.item.count as any).mockResolvedValue(50);

      await getItemsByType('user-123', 'Snippet', 3);

      expect(prisma.item.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 42,
        take: 21,
      }));
    });

    it('should sort pinned items before recently updated ones', async () => {
      (prisma.item.findMany as any).mockResolvedValue([]);
      (prisma.item.count as any).mockResolvedValue(0);

      await getItemsByType('user-123', 'Snippet');

      expect(prisma.item.findMany).toHaveBeenCalledWith(expect.objectContaining({
        orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
      }));
    });

    it('should return empty array for guest users', async () => {
      const result = await getItemsByType('guest-id', 'Snippet');
      expect(result).toEqual({ items: [], totalCount: 0 });
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
        collections: [{ collection: { id: 'col-1', name: 'React Patterns' } }],
        tags: [{ tag: { name: 'tag1' } }],
      };
      (prisma.item.findUnique as any).mockResolvedValue(mockItem);

      const result = await getItemById('user-123', 'item-1');
      expect(result?.title).toBe('Test Item');
      expect(result?.tags).toEqual(['tag1']);
      expect(result?.collections).toEqual([{ id: 'col-1', name: 'React Patterns' }]);
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

  describe('updateItem', () => {
    const updatedRow = {
      id: 'item-1',
      title: 'New Title',
      description: null,
      contentType: 'text',
      content: 'new content',
      fileUrl: null,
      fileName: null,
      fileSize: null,
      url: null,
      language: null,
      isFavorite: false,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: { id: 'type-1', name: 'Snippet', icon: 'code', color: 'blue' },
      collections: [],
      tags: [{ tag: { name: 'new-tag' } }],
    };

    it('should return null when the item does not belong to the user', async () => {
      (prisma.item.findUnique as any).mockResolvedValue(null);

      const result = await updateItem('user-123', 'item-1', {
        title: 'New Title',
        description: null,
        content: null,
        url: null,
        language: null,
        tags: [],
        collectionIds: [],
      });

      expect(result).toBeNull();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should update scalar fields and replace tags for the owning user', async () => {
      (prisma.item.findUnique as any)
        .mockResolvedValueOnce({ id: 'item-1', userId: 'user-123' })
        .mockResolvedValueOnce(updatedRow);
      (prisma.tag.findFirst as any).mockResolvedValue(null);
      (prisma.tag.create as any).mockResolvedValue({ id: 'tag-1', name: 'new-tag' });

      const result = await updateItem('user-123', 'item-1', {
        title: 'New Title',
        description: null,
        content: 'new content',
        url: null,
        language: null,
        tags: ['new-tag'],
        collectionIds: [],
      });

      expect(prisma.item.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: {
          title: 'New Title',
          description: null,
          content: 'new content',
          url: null,
          language: null,
        },
      });
      expect(prisma.itemTag.deleteMany).toHaveBeenCalledWith({ where: { itemId: 'item-1' } });
      expect(prisma.tag.create).toHaveBeenCalledWith({ data: { userId: 'user-123', name: 'new-tag' } });
      expect(prisma.itemTag.create).toHaveBeenCalledWith({ data: { itemId: 'item-1', tagId: 'tag-1' } });
      expect(result?.title).toBe('New Title');
      expect(result?.tags).toEqual(['new-tag']);
    });

    it('should reuse an existing tag instead of creating a duplicate', async () => {
      (prisma.item.findUnique as any)
        .mockResolvedValueOnce({ id: 'item-1', userId: 'user-123' })
        .mockResolvedValueOnce(updatedRow);
      (prisma.tag.findFirst as any).mockResolvedValue({ id: 'existing-tag', name: 'new-tag' });

      await updateItem('user-123', 'item-1', {
        title: 'New Title',
        description: null,
        content: null,
        url: null,
        language: null,
        tags: ['new-tag'],
        collectionIds: [],
      });

      expect(prisma.tag.create).not.toHaveBeenCalled();
      expect(prisma.itemTag.create).toHaveBeenCalledWith({ data: { itemId: 'item-1', tagId: 'existing-tag' } });
    });

    it('should only assign collections owned by the user and replace prior assignments', async () => {
      (prisma.item.findUnique as any)
        .mockResolvedValueOnce({ id: 'item-1', userId: 'user-123' })
        .mockResolvedValueOnce(updatedRow);
      (prisma.tag.findFirst as any).mockResolvedValue(null);
      (prisma.collection.findMany as any).mockResolvedValue([{ id: 'col-1' }]);

      await updateItem('user-123', 'item-1', {
        title: 'New Title',
        description: null,
        content: null,
        url: null,
        language: null,
        tags: [],
        collectionIds: ['col-1', 'col-not-owned'],
      });

      expect(prisma.collection.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['col-1', 'col-not-owned'] }, userId: 'user-123' },
        select: { id: true },
      });
      expect(prisma.itemCollection.deleteMany).toHaveBeenCalledWith({ where: { itemId: 'item-1' } });
      expect(prisma.itemCollection.create).toHaveBeenCalledTimes(1);
      expect(prisma.itemCollection.create).toHaveBeenCalledWith({ data: { itemId: 'item-1', collectionId: 'col-1' } });
    });
  });

  describe('createItem', () => {
    const createdRow = {
      id: 'item-1',
      title: 'New Item',
      description: null,
      contentType: 'text',
      content: 'console.log(1)',
      fileUrl: null,
      fileName: null,
      fileSize: null,
      url: null,
      language: 'javascript',
      isFavorite: false,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: { id: 'type-1', name: 'Snippet', icon: 'code', color: 'blue' },
      collections: [],
      tags: [{ tag: { name: 'tag1' } }],
    };

    it('should return null when the item type does not exist for the user', async () => {
      (prisma.itemType.findFirst as any).mockResolvedValue(null);

      const result = await createItem('user-123', {
        typeName: 'snippet',
        title: 'New Item',
        description: null,
        content: null,
        url: null,
        language: null,
        tags: [],
        collectionIds: [],
      });

      expect(result).toBeNull();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should create the item and its tags for the authenticated user', async () => {
      (prisma.itemType.findFirst as any).mockResolvedValue({ id: 'type-1', name: 'Snippet' });
      (prisma.item.create as any).mockResolvedValue({ id: 'item-1' });
      (prisma.tag.findFirst as any).mockResolvedValue(null);
      (prisma.tag.create as any).mockResolvedValue({ id: 'tag-1', name: 'tag1' });
      (prisma.item.findUnique as any).mockResolvedValue(createdRow);

      const result = await createItem('user-123', {
        typeName: 'snippet',
        title: 'New Item',
        description: null,
        content: 'console.log(1)',
        url: null,
        language: 'javascript',
        tags: ['tag1'],
        collectionIds: [],
      });

      expect(prisma.item.create).toHaveBeenCalledWith({
        data: {
          title: 'New Item',
          description: null,
          content: 'console.log(1)',
          url: null,
          language: 'javascript',
          contentType: 'text',
          userId: 'user-123',
          typeId: 'type-1',
        },
      });
      expect(prisma.tag.create).toHaveBeenCalledWith({ data: { userId: 'user-123', name: 'tag1' } });
      expect(prisma.itemTag.create).toHaveBeenCalledWith({ data: { itemId: 'item-1', tagId: 'tag-1' } });
      expect(result?.title).toBe('New Item');
      expect(result?.tags).toEqual(['tag1']);
    });

    it('should reuse an existing tag instead of creating a duplicate', async () => {
      (prisma.itemType.findFirst as any).mockResolvedValue({ id: 'type-1', name: 'Snippet' });
      (prisma.item.create as any).mockResolvedValue({ id: 'item-1' });
      (prisma.tag.findFirst as any).mockResolvedValue({ id: 'existing-tag', name: 'tag1' });
      (prisma.item.findUnique as any).mockResolvedValue(createdRow);

      await createItem('user-123', {
        typeName: 'snippet',
        title: 'New Item',
        description: null,
        content: null,
        url: null,
        language: null,
        tags: ['tag1'],
        collectionIds: [],
      });

      expect(prisma.tag.create).not.toHaveBeenCalled();
      expect(prisma.itemTag.create).toHaveBeenCalledWith({ data: { itemId: 'item-1', tagId: 'existing-tag' } });
    });

    it('should only assign collections owned by the user', async () => {
      (prisma.itemType.findFirst as any).mockResolvedValue({ id: 'type-1', name: 'Snippet' });
      (prisma.item.create as any).mockResolvedValue({ id: 'item-1' });
      (prisma.collection.findMany as any).mockResolvedValue([{ id: 'col-1' }]);
      (prisma.item.findUnique as any).mockResolvedValue(createdRow);

      await createItem('user-123', {
        typeName: 'snippet',
        title: 'New Item',
        description: null,
        content: null,
        url: null,
        language: null,
        tags: [],
        collectionIds: ['col-1', 'col-not-owned'],
      });

      expect(prisma.collection.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['col-1', 'col-not-owned'] }, userId: 'user-123' },
        select: { id: true },
      });
      expect(prisma.itemCollection.create).toHaveBeenCalledTimes(1);
      expect(prisma.itemCollection.create).toHaveBeenCalledWith({ data: { itemId: 'item-1', collectionId: 'col-1' } });
    });
  });

  describe('deleteItem', () => {
    it('should return false when the item does not belong to the user', async () => {
      (prisma.item.findUnique as any).mockResolvedValue(null);

      const result = await deleteItem('user-123', 'item-1');

      expect(result).toBe(false);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should delete the item and its tags for the owning user', async () => {
      (prisma.item.findUnique as any).mockResolvedValue({ id: 'item-1', userId: 'user-123' });

      const result = await deleteItem('user-123', 'item-1');

      expect(prisma.itemTag.deleteMany).toHaveBeenCalledWith({ where: { itemId: 'item-1' } });
      expect(prisma.item.delete).toHaveBeenCalledWith({ where: { id: 'item-1' } });
      expect(result).toBe(true);
    });
  });
});
