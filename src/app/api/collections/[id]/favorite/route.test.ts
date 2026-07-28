import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from './route';
import { auth } from '@/auth';
import { toggleCollectionFavorite } from '@/server/db/collections';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/server/db/collections', () => ({
  toggleCollectionFavorite: vi.fn(),
}));

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('PATCH /api/collections/[id]/favorite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when there is no session', async () => {
    (auth as any).mockResolvedValue(null);

    const response = await PATCH(new Request('http://localhost/api/collections/col-1/favorite', { method: 'PATCH' }), makeParams('col-1'));
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ success: false, error: 'Unauthorized' });
    expect(toggleCollectionFavorite).not.toHaveBeenCalled();
  });

  it('should return 404 when the collection is not owned by the user', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
    (toggleCollectionFavorite as any).mockResolvedValue(null);

    const response = await PATCH(new Request('http://localhost/api/collections/missing-id/favorite', { method: 'PATCH' }), makeParams('missing-id'));
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json).toEqual({ success: false, error: 'Collection not found' });
  });

  it('should toggle favorite for the authenticated user', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
    (toggleCollectionFavorite as any).mockResolvedValue({ isFavorite: true });

    const response = await PATCH(new Request('http://localhost/api/collections/col-1/favorite', { method: 'PATCH' }), makeParams('col-1'));
    const json = await response.json();

    expect(toggleCollectionFavorite).toHaveBeenCalledWith('user-123', 'col-1');
    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true, data: { isFavorite: true } });
  });
});
