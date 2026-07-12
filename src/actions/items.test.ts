import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toggleItemFavorite, toggleItemPin } from './items';
import { auth } from '@/auth';
import { prisma } from '@/server/prisma';

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
});
