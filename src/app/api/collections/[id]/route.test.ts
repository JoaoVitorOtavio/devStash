import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH, DELETE } from './route';
import { auth } from '@/auth';
import { updateCollection, deleteCollection } from '@/server/db/collections';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/server/db/collections', () => ({
  updateCollection: vi.fn(),
  deleteCollection: vi.fn(),
}));

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function makePatchRequest(body: unknown) {
  return new Request('http://localhost/api/collections/col-1', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('PATCH /api/collections/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when there is no session', async () => {
    (auth as any).mockResolvedValue(null);

    const response = await PATCH(makePatchRequest({ name: 'Renamed' }), makeParams('col-1'));
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ success: false, error: 'Unauthorized' });
    expect(updateCollection).not.toHaveBeenCalled();
  });

  it('should return 400 when name is missing', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-123' } });

    const response = await PATCH(makePatchRequest({ name: '   ' }), makeParams('col-1'));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(updateCollection).not.toHaveBeenCalled();
  });

  it('should return 404 when the collection is not owned by the user', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
    (updateCollection as any).mockResolvedValue(null);

    const response = await PATCH(makePatchRequest({ name: 'Renamed' }), makeParams('missing-id'));
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json).toEqual({ success: false, error: 'Collection not found' });
  });

  it('should update the collection for the authenticated user', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
    const updated = { id: 'col-1', name: 'Renamed', description: null, isFavorite: false, updatedAt: new Date() };
    (updateCollection as any).mockResolvedValue(updated);

    const response = await PATCH(makePatchRequest({ name: 'Renamed', description: null }), makeParams('col-1'));
    const json = await response.json();

    expect(updateCollection).toHaveBeenCalledWith('user-123', 'col-1', {
      name: 'Renamed',
      description: null,
    });
    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true, data: JSON.parse(JSON.stringify(updated)) });
  });
});

describe('DELETE /api/collections/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when there is no session', async () => {
    (auth as any).mockResolvedValue(null);

    const response = await DELETE(new Request('http://localhost/api/collections/col-1', { method: 'DELETE' }), makeParams('col-1'));
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ success: false, error: 'Unauthorized' });
    expect(deleteCollection).not.toHaveBeenCalled();
  });

  it('should return 404 when the collection is not owned by the user', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
    (deleteCollection as any).mockResolvedValue(false);

    const response = await DELETE(new Request('http://localhost/api/collections/missing-id', { method: 'DELETE' }), makeParams('missing-id'));
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json).toEqual({ success: false, error: 'Collection not found' });
  });

  it('should delete the collection for the authenticated user', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
    (deleteCollection as any).mockResolvedValue(true);

    const response = await DELETE(new Request('http://localhost/api/collections/col-1', { method: 'DELETE' }), makeParams('col-1'));
    const json = await response.json();

    expect(deleteCollection).toHaveBeenCalledWith('user-123', 'col-1');
    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true });
  });
});
