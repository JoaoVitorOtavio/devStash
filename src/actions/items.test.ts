import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toggleItemFavorite, toggleItemPin, updateItem } from './items';
import { auth } from '@/auth';
import { prisma } from '@/server/prisma';
import { updateItem as updateItemQuery } from '@/server/db/items';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/server/prisma', () => ({
  prisma: {
    item: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/server/db/items', () => ({
  updateItem: vi.fn(),
}));

describe('Items Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('toggleItemFavorite', () => {
    it('should return unauthorized when there is no session', async () => {
      (auth as any).mockResolvedValue(null);

      const result = await toggleItemFavorite('item-1');

      expect(result).toEqual({ success: false, error: 'Unauthorized' });
      expect(prisma.item.findUnique).not.toHaveBeenCalled();
    });

    it('should return not found when the item does not belong to the user', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
      (prisma.item.findUnique as any).mockResolvedValue(null);

      const result = await toggleItemFavorite('item-1');

      expect(result).toEqual({ success: false, error: 'Item not found' });
      expect(prisma.item.update).not.toHaveBeenCalled();
    });

    it('should flip isFavorite for the owning user', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
      (prisma.item.findUnique as any).mockResolvedValue({ id: 'item-1', isFavorite: false });
      (prisma.item.update as any).mockResolvedValue({ id: 'item-1', isFavorite: true });

      const result = await toggleItemFavorite('item-1');

      expect(prisma.item.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { isFavorite: true },
      });
      expect(result).toEqual({ success: true, data: { isFavorite: true } });
    });
  });

  describe('toggleItemPin', () => {
    it('should return unauthorized when there is no session', async () => {
      (auth as any).mockResolvedValue(null);

      const result = await toggleItemPin('item-1');

      expect(result).toEqual({ success: false, error: 'Unauthorized' });
      expect(prisma.item.findUnique).not.toHaveBeenCalled();
    });

    it('should return not found when the item does not belong to the user', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
      (prisma.item.findUnique as any).mockResolvedValue(null);

      const result = await toggleItemPin('item-1');

      expect(result).toEqual({ success: false, error: 'Item not found' });
      expect(prisma.item.update).not.toHaveBeenCalled();
    });

    it('should flip isPinned for the owning user', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
      (prisma.item.findUnique as any).mockResolvedValue({ id: 'item-1', isPinned: true });
      (prisma.item.update as any).mockResolvedValue({ id: 'item-1', isPinned: false });

      const result = await toggleItemPin('item-1');

      expect(prisma.item.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { isPinned: false },
      });
      expect(result).toEqual({ success: true, data: { isPinned: false } });
    });
  });

  describe('updateItem', () => {
    const validPayload = {
      title: 'New Title',
      description: null,
      content: 'some content',
      url: null,
      language: null,
      tags: ['tag1'],
    };

    it('should return unauthorized when there is no session', async () => {
      (auth as any).mockResolvedValue(null);

      const result = await updateItem('item-1', validPayload);

      expect(result).toEqual({ success: false, error: 'Unauthorized' });
      expect(updateItemQuery).not.toHaveBeenCalled();
    });

    it('should reject an empty title', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'user-123' } });

      const result = await updateItem('item-1', { ...validPayload, title: '   ' });

      expect(result.success).toBe(false);
      expect(updateItemQuery).not.toHaveBeenCalled();
    });

    it('should reject an invalid URL', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'user-123' } });

      const result = await updateItem('item-1', { ...validPayload, url: 'not-a-url' });

      expect(result.success).toBe(false);
      expect(updateItemQuery).not.toHaveBeenCalled();
    });

    it('should treat an empty URL string as null', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
      (updateItemQuery as any).mockResolvedValue({ id: 'item-1', title: 'New Title' });

      await updateItem('item-1', { ...validPayload, url: '' });

      expect(updateItemQuery).toHaveBeenCalledWith(
        'user-123',
        'item-1',
        expect.objectContaining({ url: null })
      );
    });

    it('should return not found when the query returns null', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
      (updateItemQuery as any).mockResolvedValue(null);

      const result = await updateItem('item-1', validPayload);

      expect(result).toEqual({ success: false, error: 'Item not found' });
    });

    it('should return the updated item on success', async () => {
      (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
      const updated = { id: 'item-1', title: 'New Title', tags: ['tag1'] };
      (updateItemQuery as any).mockResolvedValue(updated);

      const result = await updateItem('item-1', validPayload);

      expect(updateItemQuery).toHaveBeenCalledWith('user-123', 'item-1', {
        title: 'New Title',
        description: null,
        content: 'some content',
        url: null,
        language: null,
        tags: ['tag1'],
      });
      expect(result).toEqual({ success: true, data: updated });
    });
  });
});
